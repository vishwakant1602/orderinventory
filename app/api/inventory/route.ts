import { executeQuery } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const inventory = await executeQuery(`
      SELECT * FROM inventory
      ORDER BY id ASC
    `)

    return NextResponse.json(inventory)
  } catch (error) {
    console.error("Failed to fetch inventory:", error)
    return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 })
  }
}
