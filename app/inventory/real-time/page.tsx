"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Search, RefreshCw } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function RealTimeInventoryPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [inventory, setInventory] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    fetchInventory()

    // Set up polling for real-time updates
    const intervalId = setInterval(fetchInventory, 30000) // Refresh every 30 seconds

    return () => clearInterval(intervalId)
  }, [router])

  async function fetchInventory() {
    try {
      setRefreshing(true)

      // In a real app, this would be an API call
      // For demo purposes, we'll use mock data
      const response = await fetch("/api/inventory")
        .then((res) => res.json())
        .catch(() => {
          // Fallback to mock data if API fails
          return [
            {
              id: 1,
              name: "Smartphone X Pro",
              category: "Electronics",
              price: 49999.99,
              quantity: 50,
              status: "In Stock",
            },
            { id: 2, name: "Laptop Ultra", category: "Electronics", price: 89999.99, quantity: 25, status: "In Stock" },
            {
              id: 3,
              name: "Wireless Earbuds",
              category: "Electronics",
              price: 9999.99,
              quantity: 100,
              status: "In Stock",
            },
            { id: 4, name: "Designer T-shirt", category: "Clothing", price: 1999.99, quantity: 75, status: "In Stock" },
            { id: 5, name: "Formal Shoes", category: "Footwear", price: 4999.99, quantity: 30, status: "In Stock" },
            { id: 6, name: "Smart Watch", category: "Electronics", price: 14999.99, quantity: 15, status: "Low Stock" },
            {
              id: 7,
              name: "Bluetooth Speaker",
              category: "Electronics",
              price: 7999.99,
              quantity: 5,
              status: "Low Stock",
            },
            {
              id: 8,
              name: "Office Chair",
              category: "Furniture",
              price: 12999.99,
              quantity: 0,
              status: "Out of Stock",
            },
          ]
        })

      setInventory(response)
      setIsLoading(false)
    } catch (error) {
      console.error("Failed to fetch inventory:", error)
      toast({
        title: "Error",
        description: "Failed to fetch inventory data",
        variant: "destructive",
      })
    } finally {
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    fetchInventory()
    toast({
      title: "Refreshed",
      description: "Inventory data has been refreshed",
    })
  }

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter && categoryFilter !== "all" ? item.category === categoryFilter : true
    const matchesStatus = statusFilter && statusFilter !== "all" ? item.status === statusFilter : true
    return matchesSearch && matchesCategory && matchesStatus
  })

  const categories = [...new Set(inventory.map((item) => item.category))]

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <DashboardShell>
        <DashboardHeader heading="Real-Time Inventory" text="Monitor your inventory in real-time.">
          <Button onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </DashboardHeader>
        <div className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex w-full items-center space-x-2 sm:w-1/3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-9"
              />
            </div>
            <div className="flex flex-1 items-center space-x-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="h-9 w-[180px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 w-[180px]">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="In Stock">In Stock</SelectItem>
                  <SelectItem value="Low Stock">Low Stock</SelectItem>
                  <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No inventory items found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>₹{Number.parseFloat(item.price).toFixed(2)}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            item.status === "In Stock"
                              ? "bg-green-100 text-green-800"
                              : item.status === "Low Stock"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </DashboardShell>
    </DashboardLayout>
  )
}
