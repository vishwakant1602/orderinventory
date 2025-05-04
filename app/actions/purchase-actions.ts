"use server"

import { executeQuery } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function createPurchase(data: {
  customerId: number
  items: Array<{
    productId: number
    quantity: number
    price: number
  }>
  userId?: number
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
    for (const item of data.items) {
      subtotal += item.price * item.quantity
    }

    // Get tax rate from settings
    const settingsResult = await executeQuery(`SELECT tax_rate FROM settings LIMIT 1`)
    const taxRate = Number.parseFloat(settingsResult[0].tax_rate) / 100
    const tax = subtotal * taxRate
    const total = subtotal + tax

    // Get customer address
    const customerResult = await executeQuery(`SELECT address FROM customers WHERE id = $1`, [data.customerId])
    const shippingAddress = customerResult[0].address

    // Create order
    const orderResult = await executeQuery(
      `
      INSERT INTO orders (
        order_number, customer_id, order_date, subtotal, tax, total, 
        status, payment_status, shipping_address, created_by
      )
      VALUES ($1, $2, CURRENT_TIMESTAMP, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `,
      [
        orderNumber,
        data.customerId,
        subtotal,
        tax,
        total,
        "Processing",
        "Pending",
        shippingAddress,
        data.userId || null,
      ],
    )

    const orderId = orderResult[0].id

    // Create order items and update inventory
    for (const item of data.items) {
      // Get product details
      const productResult = await executeQuery(`SELECT * FROM inventory WHERE id = $1`, [item.productId])

      if (productResult.length === 0) {
        await executeQuery("ROLLBACK")
        throw new Error(`Product with ID ${item.productId} not found`)
      }

      const product = productResult[0]

      if (product.quantity < item.quantity) {
        await executeQuery("ROLLBACK")
        throw new Error(`Insufficient inventory for product ${product.name}`)
      }

      const itemSubtotal = item.price * item.quantity

      // Create order item
      await executeQuery(
        `
        INSERT INTO order_items (
          order_id, product_id, product_name, quantity, unit_price, subtotal
        )
        VALUES ($1, $2, $3, $4, $5, $6)
      `,
        [orderId, item.productId, product.name, item.quantity, item.price, itemSubtotal],
      )

      // Update inventory quantity
      const newQuantity = product.quantity - item.quantity
      let status = "In Stock"
      if (newQuantity <= 0) {
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
      [total, data.customerId],
    )

    // Generate payment record
    const paymentCountResult = await executeQuery(`SELECT COUNT(*) as count FROM payments`)
    const paymentCount = Number.parseInt(paymentCountResult[0].count) + 1
    const paymentNumber = `PAY-${String(paymentCount).padStart(3, "0")}`
    const transactionId = `TXN${Math.floor(Math.random() * 1000000000)}`

    // Create payment record
    await executeQuery(
      `
      INSERT INTO payments (
        payment_number, order_id, amount, payment_method, payment_status, 
        transaction_id, payment_date, created_by
      )
      VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, $7)
    `,
      [
        paymentNumber,
        orderId,
        total,
        "UPI", // Default payment method
        "Completed", // Assume payment is completed immediately
        transactionId,
        data.userId || null,
      ],
    )

    // Update order payment status
    await executeQuery(
      `
      UPDATE orders
      SET payment_status = 'Paid', updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `,
      [orderId],
    )

    // Commit the transaction
    await executeQuery("COMMIT")

    revalidatePath("/orders")
    revalidatePath("/inventory")
    revalidatePath("/customers")

    return {
      success: true,
      orderId,
      orderNumber,
      total,
    }
  } catch (error) {
    // Rollback the transaction in case of error
    await executeQuery("ROLLBACK")
    console.error("Failed to create purchase:", error)
    throw new Error(`Failed to create purchase: ${error.message}`)
  }
}
