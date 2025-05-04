import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Box, ShoppingCart } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <Box className="h-5 w-5" />
            <span>Order Inventory System</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="text-sm font-medium hover:underline">
              Dashboard
            </Link>
            <Link href="/inventory" className="text-sm font-medium hover:underline">
              Inventory
            </Link>
            <Link href="/orders" className="text-sm font-medium hover:underline">
              Orders
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Microservices-based Order Inventory System
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    A modern, scalable solution for managing orders and inventory with real-time updates.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/dashboard">
                    <Button size="lg" className="gap-1">
                      Get Started <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/docs">
                    <Button size="lg" variant="outline">
                      Documentation
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[350px] w-[350px] rounded-lg bg-muted p-4 shadow-lg">
                  <div className="flex h-full flex-col gap-4 rounded-md border border-border bg-card p-6">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">Order Management</h3>
                    </div>
                    <div className="grid gap-2">
                      <div className="rounded-md bg-muted p-2">
                        <div className="h-2 w-3/4 rounded-md bg-primary/20"></div>
                      </div>
                      <div className="rounded-md bg-muted p-2">
                        <div className="h-2 w-1/2 rounded-md bg-primary/20"></div>
                      </div>
                      <div className="rounded-md bg-muted p-2">
                        <div className="h-2 w-2/3 rounded-md bg-primary/20"></div>
                      </div>
                    </div>
                    <div className="mt-auto flex items-center gap-2">
                      <Box className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">Inventory Tracking</h3>
                    </div>
                    <div className="grid gap-2">
                      <div className="rounded-md bg-muted p-2">
                        <div className="h-2 w-2/3 rounded-md bg-primary/20"></div>
                      </div>
                      <div className="rounded-md bg-muted p-2">
                        <div className="h-2 w-1/2 rounded-md bg-primary/20"></div>
                      </div>
                      <div className="rounded-md bg-muted p-2">
                        <div className="h-2 w-3/4 rounded-md bg-primary/20"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Key Features</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our system provides a comprehensive solution for managing orders and inventory
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
              <div className="rounded-lg border bg-card p-6 shadow">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-primary/10 p-2">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">Order Management</h3>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Create, track, and manage orders with real-time updates and notifications.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6 shadow">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Box className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">Inventory Tracking</h3>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Monitor stock levels, set reorder points, and manage inventory items efficiently.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6 shadow">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-primary/10 p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-primary"
                    >
                      <path d="M12 3v18" />
                      <rect width="18" height="18" x="3" y="3" rx="2" />
                      <path d="M3 9h18" />
                      <path d="M3 15h18" />
                    </svg>
                  </div>
                  <h3 className="font-semibold">Dashboard Analytics</h3>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Gain insights with comprehensive analytics and reporting features.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Order Inventory System. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
