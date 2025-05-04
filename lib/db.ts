import { neon } from "@neondatabase/serverless"

// If we're running in Docker, use the local Neon proxy
const connectionString =
  process.env.NODE_ENV === "production" && process.env.DOCKER_ENV === "true"
    ? `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@db:5433/${process.env.POSTGRES_DATABASE}`
    : process.env.DATABASE_URL

// Create a SQL client
const sql = neon(connectionString)

export async function executeQuery(query, params = []) {
  try {
    console.log("Executing query:", query)
    console.log("With params:", params)

    const result = await sql(query, params)
    console.log("Query result:", result)

    return result
  } catch (error) {
    console.error("Database error:", error)
    throw error
  }
}
