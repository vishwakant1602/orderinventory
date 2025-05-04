"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Box, LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut, Menu, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"

export function DashboardLayout({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [userRole, setUserRole] = useState(null)

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"
    const role = localStorage.getItem("userRole")

    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    setUserRole(role)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userRole")
    router.push("/login")
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Inventory", href: "/inventory", icon: Package },
    { name: "Orders", href: "/orders", icon: ShoppingCart },
    { name: "Customers", href: "/customers", icon: Users },
  ]

  const adminNavigation = [{ name: "Settings", href: "/settings", icon: Settings }]

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2 md:gap-4">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                <nav className="flex flex-col gap-4 py-4">
                  <Link href="/" className="flex items-center gap-2 font-semibold" onClick={() => setIsOpen(false)}>
                    <Box className="h-6 w-6" />
                    <span>Order Inventory System</span>
                  </Link>
                  <div className="flex flex-col gap-2">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
                          pathname === item.href ? "bg-muted" : "hover:bg-muted/50"
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.name}
                      </Link>
                    ))}
                    {userRole === "admin" &&
                      adminNavigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
                            pathname === item.href ? "bg-muted" : "hover:bg-muted/50"
                          }`}
                        >
                          <item.icon className="h-5 w-5" />
                          {item.name}
                        </Link>
                      ))}
                  </div>
                  <div className="mt-auto flex flex-col gap-2">
                    <Button variant="outline" className="justify-start gap-2" onClick={toggleTheme}>
                      {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                      {theme === "dark" ? "Light Mode" : "Dark Mode"}
                    </Button>
                    <Button variant="outline" className="justify-start gap-2" onClick={handleLogout}>
                      <LogOut className="h-5 w-5" />
                      Logout
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Box className="h-6 w-6" />
              <span className="hidden md:inline-block">Order Inventory System</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2 text-sm font-medium ${
                  pathname === item.href ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
            {userRole === "admin" &&
              adminNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 text-sm font-medium ${
                    pathname === item.href ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-muted/40 md:block">
          <div className="flex h-full flex-col gap-2 p-4">
            <nav className="flex flex-col gap-1 py-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
                    pathname === item.href ? "bg-accent text-accent-foreground" : "hover:bg-muted"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </nav>
            {userRole === "admin" && (
              <>
                <div className="my-2 border-t" />
                <div className="px-3 py-2">
                  <h3 className="mb-2 text-xs font-medium uppercase text-muted-foreground">Administration</h3>
                  <nav className="flex flex-col gap-1">
                    {adminNavigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
                          pathname === item.href ? "bg-accent text-accent-foreground" : "hover:bg-muted"
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                </div>
              </>
            )}
            <div className="mt-auto">
              <div className="rounded-md bg-muted p-4">
                <div className="mb-2 flex items-center gap-2">
                  <div className="rounded-full bg-primary/10 p-1">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <h4 className="text-sm font-semibold">Role: {userRole === "admin" ? "Administrator" : "User"}</h4>
                </div>
                <p className="text-xs text-muted-foreground">
                  {userRole === "admin"
                    ? "You have full access to all features."
                    : "Some features may be restricted based on your permissions."}
                </p>
              </div>
            </div>
          </div>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
