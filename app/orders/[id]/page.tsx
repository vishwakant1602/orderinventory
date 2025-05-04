"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, CreditCard, Truck, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

export default function OrderDetailsPage({ params }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [userRole, setUserRole] = useState(null)
  const [orderDetails, setOrderDetails] = useState(null)
  const [paymentHistory, setPaymentHistory] = useState([])
  const [orderTimeline, setOrderTimeline] = useState([])
  const [orderStatus, setOrderStatus] = useState("")
  const [paymentStatus, setPaymentStatus] = useState("")

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"
    const role = localStorage.getItem("userRole")

    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    setUserRole(role)

    // Load orders from localStorage
    const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]")
    const order = savedOrders.find((o) => o.id === params.id)

    if (!order) {
      toast({
        title: "Order not found",
        description: "The requested order could not be found.",
        variant: "destructive",
      })
      router.push("/orders")
      return
    }

    // Load payments from localStorage
    const savedPayments = JSON.parse(localStorage.getItem("payments") || "[]")
    const payment = savedPayments.find((p) => p.orderId === params.id)

    // Create mock order details based on the order
    const mockOrderDetails = {
      id: order.id,
      customer: {
        id: 1,
        name: order.customer,
        email: `${order.customer.toLowerCase().replace(/\s+/g, ".")}@example.com`,
        phone: "+91 " + Math.floor(Math.random() * 9000000000 + 1000000000),
      },
      date: order.date,
      items: [
        { id: 1, name: "Product A", quantity: 2, price: 29999, subtotal: 59998 },
        { id: 3, name: "Product C", quantity: 1, price: 19999, subtotal: 19999 },
      ],
      subtotal: order.total,
      tax: Math.round(order.total * 0.18),
      total: order.total + Math.round(order.total * 0.18),
      status: order.status,
      paymentStatus: payment ? payment.status : "Pending",
      paymentMethod: payment ? payment.method : "UPI",
      shippingAddress: "123 MG Road, Bangalore, Karnataka",
      trackingNumber: "TRK" + Math.floor(Math.random() * 1000000000),
    }

    setOrderDetails(mockOrderDetails)
    setOrderStatus(order.status)
    setPaymentStatus(payment ? payment.status : "Pending")

    // Set payment history
    if (payment) {
      setPaymentHistory([
        {
          id: payment.id,
          date: payment.date,
          amount: payment.amount,
          method: payment.method,
          status: payment.status,
          transactionId: payment.transactionId,
        },
      ])
    }

    // Create mock timeline
    const mockTimeline = [
      { date: order.date + " 10:30 AM", status: "Order Placed", description: "Order was placed by customer" },
    ]

    if (payment && payment.status === "Completed") {
      mockTimeline.push({
        date: order.date + " 10:35 AM",
        status: "Payment Received",
        description: `Payment was received via ${payment.method}`,
      })
    }

    if (order.status === "Processing" || order.status === "Shipped" || order.status === "Completed") {
      mockTimeline.push({
        date: order.date + " 11:15 AM",
        status: "Processing",
        description: "Order is being processed",
      })
    }

    if (order.status === "Shipped" || order.status === "Completed") {
      mockTimeline.push({
        date: order.date + " 02:30 PM",
        status: "Shipped",
        description: "Order has been shipped via Express Delivery",
      })
    }

    if (order.status === "Completed") {
      const nextDay = new Date(order.date)
      nextDay.setDate(nextDay.getDate() + 1)
      const nextDayStr = nextDay.toISOString().split("T")[0]

      mockTimeline.push({
        date: nextDayStr + " 11:45 AM",
        status: "Delivered",
        description: "Order was delivered successfully",
      })
    }

    setOrderTimeline(mockTimeline)
    setIsLoading(false)
  }, [router, params.id, toast])

  const handleUpdateOrderStatus = (status) => {
    setOrderStatus(status)

    // Update order in localStorage
    const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]")
    const updatedOrders = savedOrders.map((order) => {
      if (order.id === params.id) {
        return { ...order, status }
      }
      return order
    })

    localStorage.setItem("orders", JSON.stringify(updatedOrders))

    // Update order details
    setOrderDetails((prev) => ({ ...prev, status }))

    // Update timeline based on new status
    let newTimeline = [...orderTimeline]

    // Remove any status updates that come after the new status
    if (status === "Processing") {
      newTimeline = newTimeline.filter((event) => !["Shipped", "Delivered"].includes(event.status))
    } else if (status === "Shipped") {
      newTimeline = newTimeline.filter((event) => event.status !== "Delivered")

      // Add shipped event if not exists
      if (!newTimeline.some((event) => event.status === "Shipped")) {
        const today = new Date().toISOString().split("T")[0]
        newTimeline.push({
          date: today + " 02:30 PM",
          status: "Shipped",
          description: "Order has been shipped via Express Delivery",
        })
      }
    } else if (status === "Completed") {
      // Add shipped event if not exists
      if (!newTimeline.some((event) => event.status === "Shipped")) {
        const today = new Date().toISOString().split("T")[0]
        newTimeline.push({
          date: today + " 02:30 PM",
          status: "Shipped",
          description: "Order has been shipped via Express Delivery",
        })
      }

      // Add delivered event if not exists
      if (!newTimeline.some((event) => event.status === "Delivered")) {
        const today = new Date().toISOString().split("T")[0]
        newTimeline.push({
          date: today + " 11:45 AM",
          status: "Delivered",
          description: "Order was delivered successfully",
        })
      }
    }

    setOrderTimeline(newTimeline)

    toast({
      title: "Order status updated",
      description: `Order status has been updated to ${status}.`,
    })
  }

  const handleUpdatePaymentStatus = (status) => {
    setPaymentStatus(status)

    // Update payment in localStorage
    const savedPayments = JSON.parse(localStorage.getItem("payments") || "[]")
    let updatedPayments = savedPayments

    const existingPayment = savedPayments.find((p) => p.orderId === params.id)

    if (existingPayment) {
      // Update existing payment
      updatedPayments = savedPayments.map((payment) => {
        if (payment.orderId === params.id) {
          return { ...payment, status }
        }
        return payment
      })
    } else {
      // Create new payment
      const newPayment = {
        id: `PAY-${String(savedPayments.length + 1).padStart(3, "0")}`,
        orderId: params.id,
        date: new Date().toISOString().split("T")[0],
        amount: orderDetails.total,
        method: "UPI",
        status: status,
        transactionId: `TXN${Math.floor(Math.random() * 1000000000)}`,
      }

      updatedPayments = [...savedPayments, newPayment]

      // Update payment history
      setPaymentHistory([
        {
          id: newPayment.id,
          date: newPayment.date,
          amount: newPayment.amount,
          method: newPayment.method,
          status: newPayment.status,
          transactionId: newPayment.transactionId,
        },
      ])
    }

    localStorage.setItem("payments", JSON.stringify(updatedPayments))

    // Update order details
    setOrderDetails((prev) => ({ ...prev, paymentStatus: status }))

    // Update timeline based on new payment status
    const newTimeline = [...orderTimeline]

    if (status === "Completed" && !newTimeline.some((event) => event.status === "Payment Received")) {
      const today = new Date().toISOString().split("T")[0]

      // Add payment received event after order placed
      const orderPlacedIndex = newTimeline.findIndex((event) => event.status === "Order Placed")

      if (orderPlacedIndex !== -1) {
        newTimeline.splice(orderPlacedIndex + 1, 0, {
          date: today + " 10:35 AM",
          status: "Payment Received",
          description: "Payment was received via UPI",
        })
      }
    }

    setOrderTimeline(newTimeline)

    toast({
      title: "Payment status updated",
      description: `Payment status has been updated to ${status}.`,
    })
  }

  const handleProcessRefund = () => {
    // Update payment status to Refunded
    handleUpdatePaymentStatus("Refunded")

    toast({
      title: "Refund processed",
      description: "The payment has been refunded successfully.",
    })
  }

  if (isLoading || !orderDetails) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <DashboardShell>
        <DashboardHeader heading={`Order #${params.id}`} text="View and manage order details.">
          <div className="flex space-x-2">
            <Link href="/orders">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
              </Button>
            </Link>
            {userRole === "admin" && <Button>Generate Invoice</Button>}
          </div>
        </DashboardHeader>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Order Information</CardTitle>
              <CardDescription>Details about the order and items purchased.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Order Date</h3>
                    <p>{orderDetails.date}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Order Status</h3>
                    <div className="flex items-center">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          orderStatus === "Completed"
                            ? "bg-green-100 text-green-800"
                            : orderStatus === "Processing"
                              ? "bg-blue-100 text-blue-800"
                              : orderStatus === "Shipped"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-red-100 text-red-800"
                        }`}
                      >
                        {orderStatus}
                      </span>
                      {userRole === "admin" && (
                        <Select value={orderStatus} onValueChange={handleUpdateOrderStatus}>
                          <SelectTrigger className="ml-2 h-7 w-[130px]">
                            <SelectValue placeholder="Update" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Processing">Processing</SelectItem>
                            <SelectItem value="Shipped">Shipped</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Payment Method</h3>
                    <p>{orderDetails.paymentMethod}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Payment Status</h3>
                    <div className="flex items-center">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          paymentStatus === "Completed"
                            ? "bg-green-100 text-green-800"
                            : paymentStatus === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : paymentStatus === "Refunded"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-red-100 text-red-800"
                        }`}
                      >
                        {paymentStatus}
                      </span>
                      {userRole === "admin" && (
                        <Select value={paymentStatus} onValueChange={handleUpdatePaymentStatus}>
                          <SelectTrigger className="ml-2 h-7 w-[130px]">
                            <SelectValue placeholder="Update" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="Refunded">Refunded</SelectItem>
                            <SelectItem value="Failed">Failed</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Shipping Address</h3>
                  <p>{orderDetails.shippingAddress}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Order Items</h3>
                  <div className="mt-2 rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Subtotal</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orderDetails.items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>₹{(item.price / 100).toFixed(2)}</TableCell>
                            <TableCell>₹{(item.subtotal / 100).toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={3} className="text-right font-medium">
                            Subtotal
                          </TableCell>
                          <TableCell className="font-medium">₹{(orderDetails.subtotal / 100).toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={3} className="text-right font-medium">
                            Tax (18%)
                          </TableCell>
                          <TableCell className="font-medium">₹{(orderDetails.tax / 100).toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={3} className="text-right font-bold">
                            Total
                          </TableCell>
                          <TableCell className="font-bold">₹{(orderDetails.total / 100).toFixed(2)}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
              <CardDescription>Details about the customer who placed this order.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                  <p className="font-medium">{orderDetails.customer.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                  <p>{orderDetails.customer.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
                  <p>{orderDetails.customer.phone}</p>
                </div>
                <div className="pt-4">
                  <Link href={`/customers/${orderDetails.customer.id}`}>
                    <Button variant="outline" className="w-full">
                      View Customer Profile
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="timeline" className="mt-4">
          <TabsList>
            <TabsTrigger value="timeline">Order Timeline</TabsTrigger>
            <TabsTrigger value="payment">Payment History</TabsTrigger>
            {orderStatus === "Shipped" && <TabsTrigger value="tracking">Tracking Information</TabsTrigger>}
          </TabsList>
          <TabsContent value="timeline" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Order Timeline</CardTitle>
                <CardDescription>Track the progress of this order.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderTimeline.map((event, index) => (
                    <div key={index} className="flex">
                      <div className="mr-4 flex flex-col items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          {event.status === "Order Placed" ? (
                            <CheckCircle className="h-5 w-5 text-primary" />
                          ) : event.status === "Payment Received" ? (
                            <CreditCard className="h-5 w-5 text-primary" />
                          ) : event.status === "Shipped" ? (
                            <Truck className="h-5 w-5 text-primary" />
                          ) : event.status === "Delivered" ? (
                            <CheckCircle className="h-5 w-5 text-primary" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        {index < orderTimeline.length - 1 && <div className="h-full w-px bg-border" />}
                      </div>
                      <div className="pb-4">
                        <p className="text-sm font-medium">{event.status}</p>
                        <p className="text-xs text-muted-foreground">{event.date}</p>
                        <p className="mt-1 text-sm">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="payment" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>View payment transactions for this order.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paymentHistory.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center">
                            No payment records found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        paymentHistory.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell className="font-medium">{payment.transactionId}</TableCell>
                            <TableCell>{payment.date}</TableCell>
                            <TableCell>{payment.method}</TableCell>
                            <TableCell>₹{(payment.amount / 100).toFixed(2)}</TableCell>
                            <TableCell>
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                  payment.status === "Completed"
                                    ? "bg-green-100 text-green-800"
                                    : payment.status === "Pending"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : payment.status === "Refunded"
                                        ? "bg-purple-100 text-purple-800"
                                        : "bg-red-100 text-red-800"
                                }`}
                              >
                                {payment.status}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              {userRole === "admin" && paymentStatus === "Completed" && (
                <CardFooter>
                  <Button variant="outline" className="ml-auto" onClick={handleProcessRefund}>
                    Process Refund
                  </Button>
                </CardFooter>
              )}
            </Card>
          </TabsContent>
          {orderStatus === "Shipped" && (
            <TabsContent value="tracking" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Tracking Information</CardTitle>
                  <CardDescription>Track the shipment of this order.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Tracking Number</h3>
                      <p className="font-medium">{orderDetails.trackingNumber}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Carrier</h3>
                      <p>Express Delivery</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Estimated Delivery</h3>
                      <p>
                        {
                          new Date(new Date(orderDetails.date).getTime() + 2 * 24 * 60 * 60 * 1000)
                            .toISOString()
                            .split("T")[0]
                        }
                      </p>
                    </div>
                    <div className="pt-2">
                      <Button className="w-full">Track Package</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </DashboardShell>
    </DashboardLayout>
  )
}
