"use server"

import { executeQuery } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function getOrders() {
  try {
    const orders = await executeQuery(`
      SELECT o.*, c.name as customer_name
      FROM orders o
      JOIN customers c ON o.customer_id = c.id
      ORDER BY o.order_date DESC
    `)
    return orders
  } catch (error) {
    console.error("Failed to fetch orders:", error)
    throw new Error("Failed to fetch orders")
  }
}

export async function getOrderById(id: number) {
  try {
    // Get order details
    const orders = await executeQuery(
      `
      SELECT o.*, c.name as customer_name, c.email as customer_email, c.phone as customer_phone
      FROM orders o
      JOIN customers c ON o.customer_id = c.id
      WHERE o.id = $1
    `,
      [id],
    )

    if (orders.length === 0) {
      return null
    }

    const order = orders[0]

    // Get order items
    const items = await executeQuery(
      `
      SELECT * FROM order_items
      WHERE order_id = $1
    `,
      [id],
    )

    // Get payment information
    const payments = await executeQuery(
      `
      SELECT * FROM payments
      WHERE order_id = $1
    `,
      [id],
    )

    return {
      ...order,
      items,
      payment: payments.length > 0 ? payments[0] : null,
    }
  } catch (error) {
    console.error(`Failed to fetch order with ID ${id}:`, error)
    throw new Error(`Failed to fetch order with ID ${id}`)
  }
}

export async function createOrder(orderData: {
  customerId: number
  items: Array<{
    productId: number
    quantity: number
  }>
  shippingAddress: string
  createdBy?: number
}) {
  try {
    // Start a transaction
    await executeQuery("BEGIN")

    // Generate order number
    const orderCountResult = await executeQuery(`SELECT COUNT(*) as count FROM orders`)
    const orderCount = Number.parseInt(orderCountResult[0].count) + 1
    const orderNumber = `ORD-${String(orderCount).padStart(3, "0")}`

    // Calculate subtotal, tax, and total
    let subtotal = 0

    // Check inventory and calculate subtotal
    for (const item of orderData.items) {
      const inventoryItem = await executeQuery(
        `
        SELECT * FROM inventory WHERE id = $1
      `,
        [item.productId],
      )

      if (inventoryItem.length === 0) {
        await executeQuery("ROLLBACK")
        throw new Error(`Product with ID ${item.productId} not found`)
      }

      if (inventoryItem[0].quantity < item.quantity) {
        await executeQuery("ROLLBACK")
        throw new Error(`Insufficient inventory for product ${inventoryItem[0].name}`)
      }

      subtotal += Number.parseFloat(inventoryItem[0].price) * item.quantity
    }

    // Get tax rate from settings
    const settingsResult = await executeQuery(`SELECT tax_rate FROM settings LIMIT 1`)
    const taxRate = Number.parseFloat(settingsResult[0].tax_rate) / 100

    const tax = subtotal * taxRate
    const total = subtotal + tax

    // Create order
    const orderResult = await executeQuery(
      `
      INSERT INTO orders (
        order_number, customer_id, subtotal, tax, total, 
        status, payment_status, shipping_address, created_by
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `,
      [
        orderNumber,
        orderData.customerId,
        subtotal,
        tax,
        total,
        "Processing",
        "Pending",
        orderData.shippingAddress,
        orderData.createdBy || null,
      ],
    )

    const orderId = orderResult[0].id

    // Create order items and update inventory
    for (const item of orderData.items) {
      const inventoryItem = await executeQuery(
        `
        SELECT * FROM inventory WHERE id = $1
      `,
        [item.productId],
      )

      const product = inventoryItem[0]
      const itemSubtotal = Number.parseFloat(product.price) * item.quantity

      // Create order item
      await executeQuery(
        `
        INSERT INTO order_items (
          order_id, product_id, product_name, quantity, unit_price, subtotal
        )
        VALUES ($1, $2, $3, $4, $5, $6)
      `,
        [orderId, item.productId, product.name, item.quantity, product.price, itemSubtotal],
      )

      // Update inventory quantity
      const newQuantity = product.quantity - item.quantity
      let status = "In Stock"
      if (newQuantity === 0) {
        status = "Out of Stock"
      } else if (newQuantity <= 10) {
        status = "Low Stock"
      }

      await executeQuery(
        `
        UPDATE inventory
        SET quantity = $1, status = $2, updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
      `,
        [newQuantity, status, item.productId],
      )
    }

    // Update customer's total_orders and total_spent
    await executeQuery(
      `
      UPDATE customers
      SET 
        total_orders = total_orders + 1,
        total_spent = total_spent + $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `,
      [total, orderData.customerId],
    )

    // Commit the transaction
    await executeQuery("COMMIT")

    revalidatePath("/orders")
    revalidatePath("/inventory")
    revalidatePath("/customers")

    return orderResult[0]
  } catch (error) {
    // Rollback the transaction in case of error
    await executeQuery("ROLLBACK")
    console.error("Failed to create order:", error)
    throw new Error(`Failed to create order: ${error.message}`)
  }
}

export async function updateOrderStatus(id: number, status: string) {
  try {
    const result = await executeQuery(
      `
      UPDATE orders
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `,
      [status, id],
    )

    revalidatePath("/orders")
    revalidatePath(`/orders/${id}`)
    return result[0]
  } catch (error) {
    console.error(`Failed to update order status for ID ${id}:`, error)
    throw new Error(`Failed to update order status for ID ${id}`)
  }
}

export async function updatePaymentStatus(id: number, paymentStatus: string) {
  try {
    // Update order payment status
    const orderResult = await executeQuery(
      `
      UPDATE orders
      SET payment_status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `,
      [paymentStatus, id],
    )

    // Check if there's an existing payment record
    const paymentResult = await executeQuery(
      `
      SELECT * FROM payments WHERE order_id = $1
    `,
      [id],
    )

    if (paymentResult.length > 0) {
      // Update existing payment record
      await executeQuery(
        `
        UPDATE payments
        SET payment_status = $1, updated_at = CURRENT_TIMESTAMP
        WHERE order_id = $2
      `,
        [paymentStatus, id],
      )
    } else if (paymentStatus === "Completed") {
      // Create new payment record if status is Completed
      const order = orderResult[0]

      // Generate payment number
      const paymentCountResult = await executeQuery(`SELECT COUNT(*) as count FROM payments`)
      const paymentCount = Number.parseInt(paymentCountResult[0].count) + 1
      const paymentNumber = `PAY-${String(paymentCount).padStart(3, "0")}`

      // Generate transaction ID
      const transactionId = `TXN${Math.floor(Math.random() * 1000000000)}`

      await executeQuery(
        `
        INSERT INTO payments (
          payment_number, order_id, amount, payment_method, payment_status, 
          transaction_id, payment_date
        )
        VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
      `,
        [
          paymentNumber,
          id,
          order.total,
          "UPI", // Default payment method
          paymentStatus,
          transactionId,
        ],
      )
    }

    revalidatePath("/orders")
    revalidatePath(`/orders/${id}`)
    return orderResult[0]
  } catch (error) {
    console.error(`Failed to update payment status for order ID ${id}:`, error)
    throw new Error(`Failed to update payment status for order ID ${id}`)
  }
}
