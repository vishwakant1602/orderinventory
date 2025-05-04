"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

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

export default function InventoryPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [inventory, setInventory] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [newItem, setNewItem] = useState({
    name: "",
    category: "Electronics",
    description: "",
    quantity: "",
    price: "",
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [userRole, setUserRole] = useState(null)
  const [editingItem, setEditingItem] = useState(null)

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"
    const role = localStorage.getItem("userRole")

    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    setUserRole(role)

    // Load inventory from localStorage if available
    const savedInventory = localStorage.getItem("inventory")
    if (savedInventory) {
      setInventory(JSON.parse(savedInventory))
    } else {
      // Use default inventory if none exists
      setInventory(defaultInventoryItems)
      localStorage.setItem("inventory", JSON.stringify(defaultInventoryItems))
    }

    setIsLoading(false)
  }, [router])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewItem((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddItem = () => {
    try {
      // Convert price and quantity to numbers
      const price = Number.parseFloat(newItem.price)
      const quantity = Number.parseInt(newItem.quantity)

      if (isNaN(price) || isNaN(quantity) || price <= 0 || quantity < 0) {
        toast({
          title: "Invalid input",
          description: "Please enter valid price and quantity values.",
          variant: "destructive",
        })
        return
      }

      const status = quantity <= 0 ? "Out of Stock" : quantity <= 10 ? "Low Stock" : "In Stock"

      if (editingItem) {
        // Update existing item
        setInventory((prev) =>
          prev.map((item) =>
            item.id === editingItem.id
              ? {
                  ...item,
                  name: newItem.name,
                  category: newItem.category,
                  description: newItem.description,
                  quantity,
                  price,
                  status,
                }
              : item,
          ),
        )

        toast({
          title: "Item updated",
          description: `${newItem.name} has been updated in the inventory.`,
        })
      } else {
        // Add new item
        const newId = Math.max(...inventory.map((item) => item.id), 0) + 1

        setInventory((prev) => [
          ...prev,
          {
            id: newId,
            name: newItem.name,
            category: newItem.category,
            description: newItem.description,
            quantity,
            price,
            status,
          },
        ])

        toast({
          title: "Item added",
          description: `${newItem.name} has been added to the inventory.`,
        })
      }

      // Save to localStorage
      const updatedInventory = editingItem
        ? inventory.map((item) =>
            item.id === editingItem.id
              ? {
                  ...item,
                  name: newItem.name,
                  category: newItem.category,
                  description: newItem.description,
                  quantity,
                  price,
                  status,
                }
              : item,
          )
        : [
            ...inventory,
            {
              id: Math.max(...inventory.map((item) => item.id), 0) + 1,
              name: newItem.name,
              category: newItem.category,
              description: newItem.description,
              quantity,
              price,
              status,
            },
          ]

      localStorage.setItem("inventory", JSON.stringify(editingItem ? updatedInventory : updatedInventory))

      // Reset form
      setNewItem({
        name: "",
        category: "Electronics",
        description: "",
        quantity: "",
        price: "",
      })
      setEditingItem(null)
      setIsDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to save inventory item",
        variant: "destructive",
      })
    }
  }

  const handleEditItem = (item) => {
    setEditingItem(item)
    setNewItem({
      name: item.name,
      category: item.category,
      description: item.description || "",
      quantity: item.quantity.toString(),
      price: item.price.toString(),
    })
    setIsDialogOpen(true)
  }

  const handleDeleteItem = (id) => {
    try {
      const updatedInventory = inventory.filter((item) => item.id !== id)
      setInventory(updatedInventory)
      localStorage.setItem("inventory", JSON.stringify(updatedInventory))

      toast({
        title: "Item deleted",
        description: "The item has been removed from inventory.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete inventory item",
        variant: "destructive",
      })
    }
  }

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter && categoryFilter !== "all" ? item.category === categoryFilter : true
    const matchesStatus = statusFilter && statusFilter !== "all" ? item.status === statusFilter : true
    return matchesSearch && matchesCategory && matchesStatus
  })

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
        <DashboardHeader heading="Inventory Management" text="View and manage your inventory items.">
          {userRole === "admin" && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add Item
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingItem ? "Edit Inventory Item" : "Add New Inventory Item"}</DialogTitle>
                  <DialogDescription>
                    {editingItem
                      ? "Update the details for this inventory item."
                      : "Fill in the details for the new inventory item."}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={newItem.name}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">
                      Category
                    </Label>
                    <Select
                      value={newItem.category}
                      onValueChange={(value) => setNewItem({ ...newItem, category: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Electronics">Electronics</SelectItem>
                        <SelectItem value="Clothing">Clothing</SelectItem>
                        <SelectItem value="Footwear">Footwear</SelectItem>
                        <SelectItem value="Furniture">Furniture</SelectItem>
                        <SelectItem value="Home Goods">Home Goods</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <Input
                      id="description"
                      name="description"
                      value={newItem.description}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="quantity" className="text-right">
                      Quantity
                    </Label>
                    <Input
                      id="quantity"
                      name="quantity"
                      type="number"
                      value={newItem.quantity}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="price" className="text-right">
                      Price (₹)
                    </Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={newItem.price}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false)
                      setEditingItem(null)
                      setNewItem({
                        name: "",
                        category: "Electronics",
                        description: "",
                        quantity: "",
                        price: "",
                      })
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddItem}>{editingItem ? "Update Item" : "Add Item"}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
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
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Clothing">Clothing</SelectItem>
                  <SelectItem value="Footwear">Footwear</SelectItem>
                  <SelectItem value="Furniture">Furniture</SelectItem>
                  <SelectItem value="Home Goods">Home Goods</SelectItem>
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
                  {userRole === "admin" && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={userRole === "admin" ? 7 : 6} className="h-24 text-center">
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
                      {userRole === "admin" && (
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditItem(item)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteItem(item.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
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
