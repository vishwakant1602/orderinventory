"use server"

import { executeQuery } from "@/lib/db"

// Get all inventory items
export async function getInventoryItems() {
  try {
    const items = await executeQuery(`
      SELECT * FROM inventory
      ORDER BY id ASC
    `)

    // Update status based on quantity
    return items.map((item) => ({
      ...item,
      status: determineStatus(item.quantity),
    }))
  } catch (error) {
    console.error("Error fetching inventory items:", error)
    throw new Error("Failed to fetch inventory items")
  }
}

// Get a single inventory item by ID
export async function getInventoryItem(id) {
  try {
    const items = await executeQuery(
      `
      SELECT * FROM inventory
      WHERE id = $1
    `,
      [id],
    )

    if (items.length === 0) {
      throw new Error("Inventory item not found")
    }

    const item = items[0]
    return {
      ...item,
      status: determineStatus(item.quantity),
    }
  } catch (error) {
    console.error(`Error fetching inventory item ${id}:`, error)
    throw new Error("Failed to fetch inventory item")
  }
}

// Create a new inventory item
export async function createInventoryItem(data) {
  try {
    const status = determineStatus(data.quantity)

    const result = await executeQuery(
      `
      INSERT INTO inventory (
        name, category, description, quantity, price, status, created_by
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `,
      [data.name, data.category, data.description || "", data.quantity, data.price, status, data.createdBy || null],
    )

    return result[0]
  } catch (error) {
    console.error("Error creating inventory item:", error)
    throw new Error("Failed to create inventory item")
  }
}

// Update an existing inventory item
export async function updateInventoryItem(id, data) {
  try {
    const status = determineStatus(data.quantity)

    const result = await executeQuery(
      `
      UPDATE inventory
      SET 
        name = $1,
        category = $2,
        description = $3,
        quantity = $4,
        price = $5,
        status = $6,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *
    `,
      [data.name, data.category, data.description || "", data.quantity, data.price, status, id],
    )

    if (result.length === 0) {
      throw new Error("Inventory item not found")
    }

    return result[0]
  } catch (error) {
    console.error(`Error updating inventory item ${id}:`, error)
    throw new Error("Failed to update inventory item")
  }
}

// Delete an inventory item
export async function deleteInventoryItem(id) {
  try {
    const result = await executeQuery(
      `
      DELETE FROM inventory
      WHERE id = $1
      RETURNING id
    `,
      [id],
    )

    if (result.length === 0) {
      throw new Error("Inventory item not found")
    }

    return { success: true }
  } catch (error) {
    console.error(`Error deleting inventory item ${id}:`, error)
    throw new Error("Failed to delete inventory item")
  }
}

// Update inventory quantity
export async function updateInventoryQuantity(id, quantityChange) {
  try {
    const result = await executeQuery(
      `
      UPDATE inventory
      SET 
        quantity = quantity + $1,
        status = CASE
          WHEN quantity + $1 <= 0 THEN 'Out of Stock'
          WHEN quantity + $1 <= 10 THEN 'Low Stock'
          ELSE 'In Stock'
        END,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `,
      [quantityChange, id],
    )

    if (result.length === 0) {
      throw new Error("Inventory item not found")
    }

    return result[0]
  } catch (error) {
    console.error(`Error updating inventory quantity for item ${id}:`, error)
    throw new Error("Failed to update inventory quantity")
  }
}

// Helper function to determine status based on quantity
function determineStatus(quantity) {
  if (quantity <= 0) return "Out of Stock"
  if (quantity <= 10) return "Low Stock"
  return "In Stock"
}
