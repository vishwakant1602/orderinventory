"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { useToast } from "@/components/ui/use-toast"
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react"

export default function PurchasePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [inventory, setInventory] = useState([])
  const [customers, setCustomers] = useState([])
  const [cart, setCart] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")

  useEffect(() => {
    async function loadData() {
      try {
        // Check if user is authenticated
        const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"
        if (!isAuthenticated) {
          router.push("/login")
          return
        }

        // Fetch inventory items
        const inventoryItems = await fetchInventoryItems()
        setInventory(inventoryItems)

        // Fetch customers
        const customersList = await fetchCustomers()
        setCustomers(customersList)

        setIsLoading(false)
      } catch (error) {
        console.error("Error loading data:", error)
        toast({
          title: "Error",
          description: "Failed to load data",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    loadData()
  }, [router, toast])

  // Mock function to fetch inventory items (replace with actual API call)
  async function fetchInventoryItems() {
    // In a real app, this would be an API call
    return [
      { id: 1, name: "Smartphone X Pro", category: "Electronics", price: 49999.99, quantity: 50, status: "In Stock" },
      { id: 2, name: "Laptop Ultra", category: "Electronics", price: 89999.99, quantity: 25, status: "In Stock" },
      { id: 3, name: "Wireless Earbuds", category: "Electronics", price: 9999.99, quantity: 100, status: "In Stock" },
      { id: 4, name: "Designer T-shirt", category: "Clothing", price: 1999.99, quantity: 75, status: "In Stock" },
      { id: 5, name: "Formal Shoes", category: "Footwear", price: 4999.99, quantity: 30, status: "In Stock" },
      { id: 6, name: "Smart Watch", category: "Electronics", price: 14999.99, quantity: 15, status: "Low Stock" },
      { id: 7, name: "Bluetooth Speaker", category: "Electronics", price: 7999.99, quantity: 5, status: "Low Stock" },
      { id: 8, name: "Office Chair", category: "Furniture", price: 12999.99, quantity: 0, status: "Out of Stock" },
    ]
  }

  // Mock function to fetch customers (replace with actual API call)
  async function fetchCustomers() {
    // In a real app, this would be an API call
    return [
      { id: 1, name: "Vishwakant", email: "vishwakant@example.com" },
      { id: 2, name: "Naman Singh", email: "naman.singh@example.com" },
      { id: 3, name: "Anup Ghimire", email: "anup.g@example.com" },
      { id: 4, name: "Kulchandra Bhatt", email: "kulchandra@example.com" },
      { id: 5, name: "Vishu Kumar", email: "vishu.k@example.com" },
    ]
  }

  const addToCart = (item) => {
    if (item.quantity <= 0) {
      toast({
        title: "Out of stock",
        description: `${item.name} is currently out of stock.`,
        variant: "destructive",
      })
      return
    }

    const existingItem = cart.find((cartItem) => cartItem.id === item.id)

    if (existingItem) {
      if (existingItem.quantity >= item.quantity) {
        toast({
          title: "Maximum quantity reached",
          description: `Only ${item.quantity} units of ${item.name} are available.`,
          variant: "destructive",
        })
        return
      }

      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1, subtotal: (cartItem.quantity + 1) * item.price }
            : cartItem,
        ),
      )
    } else {
      setCart([...cart, { ...item, quantity: 1, subtotal: item.price }])
    }

    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    })
  }

  const removeFromCart = (itemId) => {
    setCart(cart.filter((item) => item.id !== itemId))
  }

  const updateCartItemQuantity = (itemId, newQuantity) => {
    const inventoryItem = inventory.find((item) => item.id === itemId)

    if (newQuantity <= 0) {
      removeFromCart(itemId)
      return
    }

    if (newQuantity > inventoryItem.quantity) {
      toast({
        title: "Maximum quantity reached",
        description: `Only ${inventoryItem.quantity} units of ${inventoryItem.name} are available.`,
        variant: "destructive",
      })
      return
    }

    setCart(
      cart.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity, subtotal: newQuantity * item.price } : item,
      ),
    )
  }

  const handleCheckout = async () => {
    if (!selectedCustomer) {
      toast({
        title: "Customer required",
        description: "Please select a customer before checkout.",
        variant: "destructive",
      })
      return
    }

    if (cart.length === 0) {
      toast({
        title: "Empty cart",
        description: "Please add items to your cart before checkout.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)

      // In a real app, this would be an API call to create an order
      // For now, we'll simulate the process

      // 1. Create a new order
      const customer = customers.find((c) => c.id.toString() === selectedCustomer)
      const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0)
      const tax = subtotal * 0.18
      const total = subtotal + tax

      const orderNumber = `ORD-${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`

      // 2. Update inventory quantities
      const updatedInventory = inventory.map((item) => {
        const cartItem = cart.find((ci) => ci.id === item.id)
        if (cartItem) {
          return {
            ...item,
            quantity: item.quantity - cartItem.quantity,
            status:
              item.quantity - cartItem.quantity <= 0
                ? "Out of Stock"
                : item.quantity - cartItem.quantity <= 10
                  ? "Low Stock"
                  : "In Stock",
          }
        }
        return item
      })

      // 3. Update customer's total_orders and total_spent
      const customerIndex = customers.findIndex((c) => c.id.toString() === selectedCustomer)
      if (customerIndex !== -1) {
        const updatedCustomers = [...customers]
        updatedCustomers[customerIndex] = {
          ...updatedCustomers[customerIndex],
          totalOrders: (updatedCustomers[customerIndex].totalOrders || 0) + 1,
          totalSpent: (updatedCustomers[customerIndex].totalSpent || 0) + total,
        }
        setCustomers(updatedCustomers)
      }

      // Update state
      setInventory(updatedInventory)
      setCart([])
      setSelectedCustomer("")

      // Show success message
      toast({
        title: "Purchase successful",
        description: `Order #${orderNumber} has been created for ${customer.name}.`,
      })

      // Redirect to orders page
      router.push("/orders")
    } catch (error) {
      console.error("Checkout error:", error)
      toast({
        title: "Checkout failed",
        description: "An error occurred during checkout. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter && categoryFilter !== "all" ? item.category === categoryFilter : true
    return matchesSearch && matchesCategory
  })

  const cartTotal = cart.reduce((sum, item) => sum + item.subtotal, 0)
  const taxAmount = cartTotal * 0.18
  const orderTotal = cartTotal + taxAmount

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
        <DashboardHeader heading="Purchase Items" text="Browse inventory and create a new order." />

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Available Items</CardTitle>
                <CardDescription>Browse and select items to add to your cart.</CardDescription>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="flex w-full items-center space-x-2">
                    <Input
                      placeholder="Search items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="h-9"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
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
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInventory.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center">
                            No items found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredInventory.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>{item.category}</TableCell>
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
                                {item.quantity} - {item.status}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Button
                                onClick={() => addToCart(item)}
                                size="sm"
                                disabled={item.quantity <= 0}
                                variant={item.quantity <= 0 ? "outline" : "default"}
                              >
                                Add to Cart
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="mr-2 h-5 w-5" /> Shopping Cart
                </CardTitle>
                <CardDescription>Items selected for purchase.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="customer">Select Customer</Label>
                    <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                      <SelectTrigger id="customer" className="mt-1">
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id.toString()}>
                            {customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="rounded-md border">
                    {cart.length === 0 ? (
                      <div className="p-4 text-center text-sm text-muted-foreground">Your cart is empty.</div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead>Qty</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {cart.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">{item.name}</TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span>{item.quantity}</span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                              </TableCell>
                              <TableCell>₹{item.subtotal.toFixed(2)}</TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => removeFromCart(item.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </div>

                  {cart.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span>₹{cartTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tax (18%):</span>
                        <span>₹{taxAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>Total:</span>
                        <span>₹{orderTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={handleCheckout}
                  disabled={cart.length === 0 || !selectedCustomer || isLoading}
                >
                  {isLoading ? "Processing..." : "Checkout"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </DashboardShell>
    </DashboardLayout>
  )
}
