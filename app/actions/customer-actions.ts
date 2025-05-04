"use server"

import { executeQuery } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function getCustomers() {
  try {
    const customers = await executeQuery(`
      SELECT * FROM customers 
      ORDER BY id ASC
    `)
    return customers
  } catch (error) {
    console.error("Failed to fetch customers:", error)
    throw new Error("Failed to fetch customers")
  }
}

export async function getCustomerById(id: number) {
  try {
    const customers = await executeQuery(
      `
      SELECT * FROM customers 
      WHERE id = $1
    `,
      [id],
    )

    return customers[0] || null
  } catch (error) {
    console.error(`Failed to fetch customer with ID ${id}:`, error)
    throw new Error(`Failed to fetch customer with ID ${id}`)
  }
}

export async function createCustomer(customer: {
  name: string
  email: string
  phone: string
  address: string
  status?: string
}) {
  try {
    const result = await executeQuery(
      `
      INSERT INTO customers (name, email, phone, address, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `,
      [customer.name, customer.email, customer.phone, customer.address, customer.status || "Active"],
    )

    revalidatePath("/customers")
    return result[0]
  } catch (error) {
    console.error("Failed to create customer:", error)
    throw new Error("Failed to create customer")
  }
}

export async function updateCustomer(
  id: number,
  customer: {
    name?: string
    email?: string
    phone?: string
    address?: string
    status?: string
  },
) {
  try {
    // Build the SET clause dynamically based on provided fields
    const updates: string[] = []
    const values: any[] = []
    let paramIndex = 1

    if (customer.name !== undefined) {
      updates.push(`name = $${paramIndex++}`)
      values.push(customer.name)
    }

    if (customer.email !== undefined) {
      updates.push(`email = $${paramIndex++}`)
      values.push(customer.email)
    }

    if (customer.phone !== undefined) {
      updates.push(`phone = $${paramIndex++}`)
      values.push(customer.phone)
    }

    if (customer.address !== undefined) {
      updates.push(`address = $${paramIndex++}`)
      values.push(customer.address)
    }

    if (customer.status !== undefined) {
      updates.push(`status = $${paramIndex++}`)
      values.push(customer.status)
    }

    // Add updated_at timestamp
    updates.push(`updated_at = CURRENT_TIMESTAMP`)

    // Add the ID to the values array
    values.push(id)

    const result = await executeQuery(
      `
      UPDATE customers
      SET ${updates.join(", ")}
      WHERE id = $${paramIndex}
      RETURNING *
    `,
      values,
    )

    revalidatePath("/customers")
    return result[0]
  } catch (error) {
    console.error(`Failed to update customer with ID ${id}:`, error)
    throw new Error(`Failed to update customer with ID ${id}`)
  }
}

export async function deleteCustomer(id: number) {
  try {
    // Check if the customer has any orders
    const orders = await executeQuery(
      `
      SELECT COUNT(*) as count FROM orders WHERE customer_id = $1
    `,
      [id],
    )

    if (orders[0].count > 0) {
      throw new Error("Cannot delete customer with existing orders")
    }

    await executeQuery(
      `
      DELETE FROM customers
      WHERE id = $1
    `,
      [id],
    )

    revalidatePath("/customers")
    return { success: true }
  } catch (error) {
    console.error(`Failed to delete customer with ID ${id}:`, error)
    throw new Error(`Failed to delete customer with ID ${id}: ${error.message}`)
  }
}
