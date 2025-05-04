"use server"

import { cookies } from "next/headers"
import { executeQuery } from "@/lib/db"

// Mock authentication for demo purposes
export async function login(username, password) {
  try {
    console.log("Login attempt for:", username)

    // In a real app, you would hash the password and compare with the stored hash
    const users = await executeQuery(
      `
      SELECT id, username, full_name, role
      FROM users
      WHERE username = $1 AND password = $2 AND active = true
    `,
      [username, password],
    ) // Using direct comparison for demo purposes

    console.log("Query result:", users)

    if (!users || users.length === 0) {
      console.log("No user found with these credentials")
      return { success: false, message: "Invalid username or password" }
    }

    const user = users[0]
    console.log("User found:", user)

    // Set a cookie to maintain the session
    cookies().set("user_id", user.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    })

    cookies().set("user_role", user.role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    })

    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.full_name,
        role: user.role,
      },
    }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, message: "An error occurred during login" }
  }
}

export async function logout() {
  cookies().delete("user_id")
  cookies().delete("user_role")
  return { success: true }
}

export async function getAuthStatus() {
  const userId = cookies().get("user_id")?.value
  const userRole = cookies().get("user_role")?.value

  if (!userId || !userRole) {
    return { isAuthenticated: false }
  }

  try {
    const users = await executeQuery(
      `
      SELECT id, username, full_name, role
      FROM users
      WHERE id = $1 AND active = true
    `,
      [userId],
    )

    if (users.length === 0) {
      return { isAuthenticated: false }
    }

    const user = users[0]

    return {
      isAuthenticated: true,
      userId: user.id,
      username: user.username,
      fullName: user.full_name,
      userRole: user.role,
    }
  } catch (error) {
    console.error("Auth status error:", error)
    return { isAuthenticated: false }
  }
}
