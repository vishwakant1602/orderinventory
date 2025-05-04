"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Plus, Search, Eye, Trash2, Edit, AlertCircle } from "lucide-react"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Mock orders data
const mockOrders = [
  { id: "ORD-001", customer: "Vishwakant", date: "2023-05-15", items: 3, total: 59997, status: "Completed" },
  { id: "ORD-002", customer: "Naman Singh", date: "2023-05-16", items: 2, total: 12998, status: "Processing" },
  { id: "ORD-003", customer: "Anup Ghimire", date: "2023-05-17", items: 1, total: 29999, status: "Shipped" },
  { id: "ORD-004", customer: "Kulchandra Bhatt", date: "2023-05-18", items: 4, total: 45996, status: "Processing" },
  { id: "ORD-005", customer: "Vishu Kumar", date: "2023-05-19", items: 2, total: 9998, status: "Completed" },
  { id: "ORD-006", customer: "Rajesh Patel", date: "2023-05-20", items: 3, total: 34997, status: "Cancelled" },
  { id: "ORD-007", customer: "Priya Verma", date: "2023-05-21", items: 1, total: 19999, status: "Shipped" },
  { id: "ORD-008", customer: "Amit Desai", date: "2023-05-22", items: 5, total: 74995, status: "Processing" },
]

// Default inventory items if none exist in localStorage
const defaultInventoryItems = [
  { id: 1, name: "Smartphone", category: "Electronics", quantity: 25, price: 15000, status: "In Stock" },
  { id: 2, name: "Laptop", category: "Electronics", quantity: 10, price: 45000, status: "In Stock" },
  { id: 3, name: "T-Shirt", category: "Clothing", quantity: 50, price: 500, status: "In Stock" },
  { id: 4, name: "Jeans", category: "Clothing", quantity: 30, price: 1200, status: "In Stock" },
  { id: 5, name: "Running Shoes", category: "Footwear", quantity: 15, price: 2500, status: "In Stock" },
  { id: 6, name: "Office Chair", category: "Furniture", quantity: 8, price: 3500, status: "Low Stock" },
  { id: 7, name: "Coffee Table", category: "Furniture", quantity: 5, price: 4500, status: "Low Stock" },
  { id: 8, name: "Bedsheet", category: "Home Goods", quantity: 20, price: 800, status: "In Stock" },
  { id: 9, name: "Curtains", category: "Home Goods", quantity: 0, price: 1500, status: "Out of Stock" },
  { id: 10, name: "Bluetooth Speaker", category: "Electronics", quantity: 3, price: 2000, status: "Low Stock" },
]

// Default customers if none exist in localStorage
const defaultCustomers = [
  {
    id: 1,
    name: "Vishwakant",
    email: "vishwakant@example.com",
    phone: "+91 9876543210",
    address: "123 MG Road, Bangalore, Karnataka",
    totalOrders: 5,
    totalSpent: 24999.95,
    status: "Active",
    balance: 50000,
  },
  {
    id: 2,
    name: "Naman Singh",
    email: "naman.singh@example.com",
    phone: "+91 8765432109",
    address: "456 Sector 18, Noida, Uttar Pradesh",
    totalOrders: 3,
    totalSpent: 12499.97,
    status: "Active",
    balance: 25000,
  },
  {
    id: 3,
    name: "Anup Ghimire",
    email: "anup.g@example.com",
    phone: "+91 7654321098",
    address: "789 Park Street, Kolkata, West Bengal",
    totalOrders: 7,
    totalSpent: 35699.93,
    status: "Active",
    balance: 40000,
  },
  {
    id: 4,
    name: "Kulchandra Bhatt",
    email: "kulchandra@example.com",
    phone: "+91 6543210987",
    address: "234 Civil Lines, Delhi",
    totalOrders: 2,
    totalSpent: 8999.98,
    status: "Inactive",
    balance: 15000,
  },
  {
    id: 5,
    name: "Vishu Kumar",
    email: "vishu.k@example.com",
    phone: "+91 5432109876",
    address: "567 FC Road, Pune, Maharashtra",
    totalOrders: 4,
    totalSpent: 19999.96,
    status: "Active",
    balance: 30000,
  },
  {
    id: 6,
    name: "Rajesh Patel",
    email: "rajesh.p@example.com",
    phone: "+91 4321098765",
    address: "890 Jubilee Hills, Hyderabad, Telangana",
    totalOrders: 6,
    totalSpent: 29999.94,
    status: "Active",
    balance: 35000,
  },
  {
    id: 7,
    name: "Priya Verma",
    email: "priya.v@example.com",
    phone: "+91 3210987654",
    address: "123 Anna Nagar, Chennai, Tamil Nadu",
    totalOrders: 1,
    totalSpent: 4999.99,
    status: "Inactive",
    balance: 10000,
  },
  {
    id: 8,
    name: "Amit Desai",
    email: "amit.d@example.com",
    phone: "+91 2109876543",
    address: "456 Navrangpura, Ahmedabad, Gujarat",
    totalOrders: 8,
    totalSpent: 39999.92,
    status: "Active",
    balance: 45000,
  },
]

// Available order statuses
const orderStatuses = ["Processing", "Shipped", "Completed", "Cancelled"]

export default function OrdersPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [orders, setOrders] = useState(mockOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [newStatus, setNewStatus] = useState("")
  const [userRole, setUserRole] = useState(null)
  const [newOrder, setNewOrder] = useState({
    customer: "",
    items: [],
  })
  const [selectedItem, setSelectedItem] = useState("")
  const [selectedQuantity, setSelectedQuantity] = useState(1)
  const [orderItems, setOrderItems] = useState([])
  const [inventory, setInventory] = useState([])
  const [customers, setCustomers] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [orderTotal, setOrderTotal] = useState(0)

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"
    const role = localStorage.getItem("userRole")

    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    setUserRole(role)

    // Load orders from localStorage if available
    const savedOrders = localStorage.getItem("orders")
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders))
    }

    // Load inventory from localStorage if available
    const savedInventory = localStorage.getItem("inventory")
    if (savedInventory) {
      setInventory(JSON.parse(savedInventory))
    } else {
      // Use default inventory if none exists
      setInventory(defaultInventoryItems)
      localStorage.setItem("inventory", JSON.stringify(defaultInventoryItems))
    }

    // Load customers from localStorage if available
    const savedCustomers = localStorage.getItem("customers")
    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers))
    } else {
      // Use default customers if none exists
      setCustomers(defaultCustomers)
      localStorage.setItem("customers", JSON.stringify(defaultCustomers))
    }

    setIsLoading(false)
  }, [router])

  // Update order total whenever order items change
  useEffect(() => {
    const total = orderItems.reduce((sum, item) => sum + item.subtotal, 0)
    setOrderTotal(total)
  }, [orderItems])

  // Update selected customer whenever customer selection changes
  useEffect(() => {
    if (newOrder.customer) {
      const customer = customers.find((c) => c.name === newOrder.customer)
      setSelectedCustomer(customer)
    } else {
      setSelectedCustomer(null)
    }
  }, [newOrder.customer, customers])

  const handleAddItem = () => {
    if (!selectedItem) return

    const item = inventory.find((item) => item.id === Number.parseInt(selectedItem))

    if (!item) return

    // Checkif quantity is available
    if (item.quantity < selectedQuantity) {
      toast({
        title: "Insufficient inventory",
        description: `Only ${item.quantity} units of ${item.name} are available.`,
        variant: "destructive",
      })
      return
    }

    const existingItemIndex = orderItems.findIndex((orderItem) => orderItem.id === item.id)

    if (existingItemIndex >= 0) {
      // Update existing item quantity
      const updatedItems = [...orderItems]
      updatedItems[existingItemIndex].quantity += selectedQuantity
      updatedItems[existingItemIndex].subtotal = updatedItems[existingItemIndex].quantity * item.price
      setOrderItems(updatedItems)
    } else {
      // Add new item
      const newItem = {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: selectedQuantity,
        subtotal: item.price * selectedQuantity,
      }
      setOrderItems([...orderItems, newItem])
    }

    setSelectedItem("")
    setSelectedQuantity(1)
  }

  const handleRemoveItem = (id) => {
    setOrderItems(orderItems.filter((item) => item.id !== id))
  }

  const handleCreateOrder = () => {
    if (!newOrder.customer || orderItems.length === 0) return

    // Calculate total
    const total = orderItems.reduce((sum, item) => sum + item.subtotal, 0)

    // Check if customer has sufficient balance
    if (!selectedCustomer || selectedCustomer.balance < total) {
      toast({
        title: "Insufficient balance",
        description: `${selectedCustomer?.name} does not have sufficient balance to complete this order.`,
        variant: "destructive",
      })
      return
    }

    // Generate order ID
    const orderId = `ORD-${String(orders.length + 1).padStart(3, "0")}`

    // Create new order
    const newOrderObj = {
      id: orderId,
      customer: newOrder.customer,
      date: new Date().toISOString().split("T")[0],
      items: orderItems.length,
      total: total,
      status: "Processing",
    }

    // Update inventory quantities
    const updatedInventory = inventory.map((item) => {
      const orderItem = orderItems.find((oi) => oi.id === item.id)
      if (orderItem) {
        const newQuantity = item.quantity - orderItem.quantity
        let newStatus = "In Stock"
        if (newQuantity <= 0) {
          newStatus = "Out of Stock"
        } else if (newQuantity <= 10) {
          newStatus = "Low Stock"
        }

        return {
          ...item,
          quantity: newQuantity,
          status: newStatus,
        }
      }
      return item
    })

    // Update customer balance and stats
    const updatedCustomers = customers.map((customer) => {
      if (customer.id === selectedCustomer.id) {
        return {
          ...customer,
          balance: customer.balance - total,
          totalOrders: customer.totalOrders + 1,
          totalSpent: customer.totalSpent + total,
        }
      }
      return customer
    })

    // Update state
    const updatedOrders = [newOrderObj, ...orders]
    setOrders(updatedOrders)
    setInventory(updatedInventory)
    setCustomers(updatedCustomers)

    // Save to localStorage for persistence
    localStorage.setItem("orders", JSON.stringify(updatedOrders))
    localStorage.setItem("inventory", JSON.stringify(updatedInventory))
    localStorage.setItem("customers", JSON.stringify(updatedCustomers))

    // Create payment record
    const payment = {
      id: `PAY-${String(orders.length + 1).padStart(3, "0")}`,
      orderId: orderId,
      date: new Date().toISOString().split("T")[0],
      amount: total,
      method: "Account Balance",
      status: "Completed",
      transactionId: `TXN${Math.floor(Math.random() * 1000000000)}`,
    }

    // Save payment to localStorage
    const savedPayments = JSON.parse(localStorage.getItem("payments") || "[]")
    localStorage.setItem("payments", JSON.stringify([...savedPayments, payment]))

    // Reset form
    setNewOrder({ customer: "", items: [] })
    setOrderItems([])
    setIsDialogOpen(false)

    // Show success toast
    toast({
      title: "Order created successfully",
      description: `Order #${orderId} has been created and ₹${total.toFixed(2)} has been deducted from ${selectedCustomer.name}'s balance.`,
    })
  }

  const handleDeleteOrder = (id) => {
    const updatedOrders = orders.filter((order) => order.id !== id)
    setOrders(updatedOrders)
    localStorage.setItem("orders", JSON.stringify(updatedOrders))

    toast({
      title: "Order deleted",
      description: `Order #${id} has been deleted.`,
    })
  }

  const openStatusChangeDialog = (order) => {
    setSelectedOrder(order)
    setNewStatus(order.status)
    setIsStatusDialogOpen(true)
  }

  const handleStatusChange = () => {
    if (!selectedOrder || !newStatus) return

    // Update order status
    const updatedOrders = orders.map((order) => {
      if (order.id === selectedOrder.id) {
        return { ...order, status: newStatus }
      }
      return order
    })

    // Update state
    setOrders(updatedOrders)

    // Save to localStorage for persistence
    localStorage.setItem("orders", JSON.stringify(updatedOrders))

    // Close dialog and reset
    setIsStatusDialogOpen(false)
    setSelectedOrder(null)
    setNewStatus("")

    // Show success toast
    toast({
      title: "Order status updated",
      description: `Order #${selectedOrder.id} status has been updated to ${newStatus}.`,
    })
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter && statusFilter !== "all" ? order.status === statusFilter : true
    return matchesSearch && matchesStatus
  })

  // Filter inventory to only show items with quantity > 0
  const availableInventory = inventory.filter((item) => item.quantity > 0)

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
        <DashboardHeader heading="Order Management" text="View and manage customer orders.">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Create Order
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Order</DialogTitle>
                <DialogDescription>Fill in the details to create a new customer order.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="customer" className="text-right">
                    Customer
                  </Label>
                  <Select
                    value={newOrder.customer}
                    onValueChange={(value) => setNewOrder({ ...newOrder, customer: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers
                        .filter((customer) => customer.status === "Active")
                        .map((customer) => (
                          <SelectItem key={customer.id} value={customer.name}>
                            {customer.name} (Balance: ₹{customer.balance.toFixed(2)})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedCustomer && (
                  <div className="col-span-4">
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Customer Balance</AlertTitle>
                      <AlertDescription>
                        {selectedCustomer.name} has a balance of ₹{selectedCustomer.balance.toFixed(2)}
                      </AlertDescription>
                    </Alert>
                  </div>
                )}

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Add Items</Label>
                  <div className="col-span-3 flex gap-2">
                    <Select value={selectedItem} onValueChange={setSelectedItem}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select item" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableInventory.map((item) => (
                          <SelectItem key={item.id} value={item.id.toString()}>
                            {item.name} - ₹{item.price.toFixed(2)} ({item.quantity} in stock)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      min="1"
                      value={selectedQuantity}
                      onChange={(e) => setSelectedQuantity(Number.parseInt(e.target.value) || 1)}
                      className="w-20"
                    />
                    <Button type="button" onClick={handleAddItem} size="sm">
                      Add
                    </Button>
                  </div>
                </div>
                {orderItems.length > 0 && (
                  <div className="col-span-4 mt-2">
                    <Label className="mb-2 block">Order Items</Label>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Qty</TableHead>
                            <TableHead>Subtotal</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {orderItems.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.name}</TableCell>
                              <TableCell>₹{item.price.toFixed(2)}</TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>₹{item.subtotal.toFixed(2)}</TableCell>
                              <TableCell>
                                <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableCell colSpan={3} className="text-right font-bold">
                              Total:
                            </TableCell>
                            <TableCell className="font-bold">₹{orderTotal.toFixed(2)}</TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}

                {selectedCustomer && orderTotal > 0 && (
                  <div className="col-span-4">
                    <Alert className={selectedCustomer.balance < orderTotal ? "bg-red-50" : "bg-green-50"}>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Payment Status</AlertTitle>
                      <AlertDescription className="flex flex-col gap-1">
                        <div>Order Total: ₹{orderTotal.toFixed(2)}</div>
                        <div>Customer Balance: ₹{selectedCustomer.balance.toFixed(2)}</div>
                        <div
                          className={
                            selectedCustomer.balance < orderTotal
                              ? "text-red-600 font-medium"
                              : "text-green-600 font-medium"
                          }
                        >
                          {selectedCustomer.balance < orderTotal
                            ? `Insufficient balance (₹${(selectedCustomer.balance - orderTotal).toFixed(2)})`
                            : `Sufficient balance (₹${(selectedCustomer.balance - orderTotal).toFixed(2)} remaining after purchase)`}
                        </div>
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateOrder}
                  disabled={
                    !newOrder.customer ||
                    orderItems.length === 0 ||
                    (selectedCustomer && selectedCustomer.balance < orderTotal)
                  }
                >
                  Create Order
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Status Change Dialog */}
          <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Update Order Status</DialogTitle>
                <DialogDescription>Change the status of order #{selectedOrder?.id}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {orderStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleStatusChange}>Update Status</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </DashboardHeader>
        <div className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex w-full items-center space-x-2 sm:w-1/3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-9"
              />
            </div>
            <div className="flex flex-1 items-center space-x-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 w-[180px]">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Shipped">Shipped</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No orders found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>{order.items}</TableCell>
                      <TableCell>₹{order.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            order.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : order.status === "Processing"
                                ? "bg-blue-100 text-blue-800"
                                : order.status === "Shipped"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-red-100 text-red-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Link href={`/orders/${order.id}`}>
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          {userRole === "admin" && (
                            <>
                              <Button variant="ghost" size="icon" onClick={() => openStatusChangeDialog(order)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteOrder(order.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
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
