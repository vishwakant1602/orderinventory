"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Box } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = (role) => {
    setIsLoading(true)

    // Store authentication state in localStorage
    localStorage.setItem("isAuthenticated", "true")
    localStorage.setItem("userRole", role)

    // Redirect to dashboard
    router.push("/dashboard")
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center">
            <Box className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-center text-2xl">Order Inventory System</CardTitle>
          <CardDescription className="text-center">Select your role to continue</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center"
              onClick={() => handleLogin("user")}
              disabled={isLoading}
            >
              <span className="text-lg font-medium">User</span>
              <span className="text-xs text-muted-foreground">Limited access</span>
            </Button>
            <Button
              className="h-20 flex flex-col items-center justify-center"
              onClick={() => handleLogin("admin")}
              disabled={isLoading}
            >
              <span className="text-lg font-medium">Administrator</span>
              <span className="text-xs">Full access</span>
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="mt-2 text-center text-sm text-muted-foreground">
            This is a demo application for order and inventory management
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
