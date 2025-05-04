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
import { Plus, Search, Edit, Trash2, Phone, Mail, Wallet } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

// Mock customers data with Indian names and balance
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

export default function CustomersPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [customers, setCustomers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isAddFundsDialogOpen, setIsAddFundsDialogOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [fundAmount, setFundAmount] = useState("")
  const [userRole, setUserRole] = useState(null)
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    status: "Active",
    balance: 0,
  })

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"
    const role = localStorage.getItem("userRole")

    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    setUserRole(role)

    // Load customers from localStorage if available
    const savedCustomers = localStorage.getItem("customers")
    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers))
    } else {
      // Initialize with default customers
      setCustomers(defaultCustomers)
      localStorage.setItem("customers", JSON.stringify(defaultCustomers))
    }

    setIsLoading(false)
  }, [router])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewCustomer((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddCustomer = () => {
    const newCustomerWithId = {
      id: customers.length + 1,
      ...newCustomer,
      totalOrders: 0,
      totalSpent: 0,
      balance: Number(newCustomer.balance) || 0,
    }

    const updatedCustomers = [...customers, newCustomerWithId]
    setCustomers(updatedCustomers)
    localStorage.setItem("customers", JSON.stringify(updatedCustomers))

    setNewCustomer({
      name: "",
      email: "",
      phone: "",
      address: "",
      status: "Active",
      balance: 0,
    })
    setIsDialogOpen(false)

    toast({
      title: "Customer added",
      description: `${newCustomerWithId.name} has been added successfully.`,
    })
  }

  const handleDeleteCustomer = (id) => {
    const updatedCustomers = customers.filter((customer) => customer.id !== id)
    setCustomers(updatedCustomers)
    localStorage.setItem("customers", JSON.stringify(updatedCustomers))

    toast({
      title: "Customer deleted",
      description: "Customer has been deleted successfully.",
    })
  }

  const openAddFundsDialog = (customer) => {
    setSelectedCustomer(customer)
    setFundAmount("")
    setIsAddFundsDialogOpen(true)
  }

  const handleAddFunds = () => {
    if (!selectedCustomer || !fundAmount || isNaN(Number(fundAmount)) || Number(fundAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to add.",
        variant: "destructive",
      })
      return
    }

    const amount = Number(fundAmount)

    const updatedCustomers = customers.map((customer) => {
      if (customer.id === selectedCustomer.id) {
        return {
          ...customer,
          balance: customer.balance + amount,
        }
      }
      return customer
    })

    setCustomers(updatedCustomers)
    localStorage.setItem("customers", JSON.stringify(updatedCustomers))

    setIsAddFundsDialogOpen(false)
    setSelectedCustomer(null)
    setFundAmount("")

    toast({
      title: "Funds added",
      description: `₹${amount.toFixed(2)} has been added to the customer's balance.`,
    })
  }

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter && statusFilter !== "all" ? customer.status === statusFilter : true
    return matchesSearch && matchesStatus
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
        <DashboardHeader heading="Customer Management" text="View and manage your customers.">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
                <DialogDescription>Fill in the details to add a new customer to your system.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={newCustomer.name}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder="Full name"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={newCustomer.email}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder="Email address"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={newCustomer.phone}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder="Phone number"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="address" className="text-right">
                    Address
                  </Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={newCustomer.address}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder="Full address"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="balance" className="text-right">
                    Initial Balance
                  </Label>
                  <Input
                    id="balance"
                    name="balance"
                    type="number"
                    value={newCustomer.balance}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder="Initial account balance"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Select
                    value={newCustomer.status}
                    onValueChange={(value) => setNewCustomer({ ...newCustomer, status: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddCustomer}>Add Customer</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Add Funds Dialog */}
          <Dialog open={isAddFundsDialogOpen} onOpenChange={setIsAddFundsDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Funds</DialogTitle>
                <DialogDescription>Add funds to {selectedCustomer?.name}'s account balance.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    Amount (₹)
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    value={fundAmount}
                    onChange={(e) => setFundAmount(e.target.value)}
                    className="col-span-3"
                    placeholder="Enter amount"
                    min="1"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <div className="text-right">Current Balance:</div>
                  <div className="col-span-3 font-medium">₹{selectedCustomer?.balance.toFixed(2)}</div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddFundsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddFunds}>Add Funds</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </DashboardHeader>
        <div className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex w-full items-center space-x-2 sm:w-1/3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
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
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
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
                  <TableHead>Contact</TableHead>
                  <TableHead>Total Orders</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No customers found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>{customer.id}</TableCell>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <Mail className="mr-1 h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{customer.email}</span>
                          </div>
                          <div className="flex items-center">
                            <Phone className="mr-1 h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{customer.phone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{customer.totalOrders}</TableCell>
                      <TableCell>₹{customer.totalSpent.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Wallet className="mr-1 h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">₹{customer.balance.toFixed(2)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            customer.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {customer.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Add Funds"
                            onClick={() => openAddFundsDialog(customer)}
                          >
                            <Wallet className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          {userRole === "admin" && (
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteCustomer(customer.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
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
