"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Save, UserPlus } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Mock users data
const mockUsers = [
  { id: 1, username: "admin", email: "admin@example.com", role: "admin", status: "Active" },
  { id: 2, username: "user", email: "user@example.com", role: "user", status: "Active" },
  { id: 3, username: "vishwakant", email: "vishwakant@example.com", role: "user", status: "Active" },
  { id: 4, username: "naman", email: "naman@example.com", role: "user", status: "Inactive" },
  { id: 5, username: "anup", email: "anup@example.com", role: "admin", status: "Active" },
]

export default function SettingsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [userRole, setUserRole] = useState(null)
  const [users, setUsers] = useState(mockUsers)
  const [generalSettings, setGeneralSettings] = useState({
    companyName: "Order Inventory System",
    contactEmail: "support@orderinventory.com",
    contactPhone: "+91 1234567890",
    address: "123 Business Park, Tech Hub, Bangalore, India",
    currency: "INR",
    taxRate: "18",
  })
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    orderUpdates: true,
    inventoryAlerts: true,
    paymentNotifications: true,
    systemUpdates: false,
  })
  const [integrationSettings, setIntegrationSettings] = useState({
    paymentGateway: "razorpay",
    paymentGatewayApiKey: "rzp_test_1234567890abcdef",
    enablePaymentGateway: true,
  })

  useEffect(() => {
    // Check if user is authenticated and is admin
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"
    const role = localStorage.getItem("userRole")

    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (role !== "admin") {
      router.push("/dashboard")
      return
    }

    setUserRole(role)
    setIsLoading(false)
  }, [router])

  const handleGeneralSettingsChange = (e) => {
    const { name, value } = e.target
    setGeneralSettings((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleNotificationToggle = (setting) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }))
  }

  const handleIntegrationChange = (name, value) => {
    setIntegrationSettings((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSaveSettings = () => {
    // In a real app, this would save to a backend
    alert("Settings saved successfully!")
  }

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
        <DashboardHeader heading="System Settings" text="Manage your system configuration and preferences.">
          <Button onClick={handleSaveSettings}>
            <Save className="mr-2 h-4 w-4" /> Save Changes
          </Button>
        </DashboardHeader>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Configure your basic system settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      value={generalSettings.companyName}
                      onChange={handleGeneralSettingsChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input
                      id="contactEmail"
                      name="contactEmail"
                      type="email"
                      value={generalSettings.contactEmail}
                      onChange={handleGeneralSettingsChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Contact Phone</Label>
                    <Input
                      id="contactPhone"
                      name="contactPhone"
                      value={generalSettings.contactPhone}
                      onChange={handleGeneralSettingsChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Business Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={generalSettings.address}
                      onChange={handleGeneralSettingsChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={generalSettings.currency}
                      onValueChange={(value) => setGeneralSettings((prev) => ({ ...prev, currency: value }))}
                    >
                      <SelectTrigger id="currency">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                        <SelectItem value="USD">US Dollar ($)</SelectItem>
                        <SelectItem value="EUR">Euro (€)</SelectItem>
                        <SelectItem value="GBP">British Pound (£)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxRate">Tax Rate (%)</Label>
                    <Input
                      id="taxRate"
                      name="taxRate"
                      type="number"
                      value={generalSettings.taxRate}
                      onChange={handleGeneralSettingsChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage system users and their permissions.</CardDescription>
                </div>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" /> Add User
                </Button>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.id}</TableCell>
                          <TableCell className="font-medium">{user.username}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Select defaultValue={user.role}>
                              <SelectTrigger className="w-[100px]">
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="user">User</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                user.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                              }`}
                            >
                              {user.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                Edit
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-500">
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure how and when you receive notifications.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="emailNotifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={() => handleNotificationToggle("emailNotifications")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="orderUpdates">Order Updates</Label>
                      <p className="text-sm text-muted-foreground">Get notified about order status changes</p>
                    </div>
                    <Switch
                      id="orderUpdates"
                      checked={notificationSettings.orderUpdates}
                      onCheckedChange={() => handleNotificationToggle("orderUpdates")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="inventoryAlerts">Inventory Alerts</Label>
                      <p className="text-sm text-muted-foreground">Get notified about low stock items</p>
                    </div>
                    <Switch
                      id="inventoryAlerts"
                      checked={notificationSettings.inventoryAlerts}
                      onCheckedChange={() => handleNotificationToggle("inventoryAlerts")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="paymentNotifications">Payment Notifications</Label>
                      <p className="text-sm text-muted-foreground">Get notified about payment status changes</p>
                    </div>
                    <Switch
                      id="paymentNotifications"
                      checked={notificationSettings.paymentNotifications}
                      onCheckedChange={() => handleNotificationToggle("paymentNotifications")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="systemUpdates">System Updates</Label>
                      <p className="text-sm text-muted-foreground">Get notified about system updates and maintenance</p>
                    </div>
                    <Switch
                      id="systemUpdates"
                      checked={notificationSettings.systemUpdates}
                      onCheckedChange={() => handleNotificationToggle("systemUpdates")}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Payment Gateway Integration</CardTitle>
                <CardDescription>Configure your payment gateway settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enablePaymentGateway">Enable Payment Gateway</Label>
                      <p className="text-sm text-muted-foreground">Allow customers to make payments</p>
                    </div>
                    <Switch
                      id="enablePaymentGateway"
                      checked={integrationSettings.enablePaymentGateway}
                      onCheckedChange={() =>
                        handleIntegrationChange("enablePaymentGateway", !integrationSettings.enablePaymentGateway)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paymentGateway">Payment Gateway Provider</Label>
                    <Select
                      value={integrationSettings.paymentGateway}
                      onValueChange={(value) => handleIntegrationChange("paymentGateway", value)}
                    >
                      <SelectTrigger id="paymentGateway">
                        <SelectValue placeholder="Select payment gateway" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="razorpay">Razorpay</SelectItem>
                        <SelectItem value="paytm">Paytm</SelectItem>
                        <SelectItem value="stripe">Stripe</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paymentGatewayApiKey">API Key</Label>
                    <Input
                      id="paymentGatewayApiKey"
                      value={integrationSettings.paymentGatewayApiKey}
                      onChange={(e) => handleIntegrationChange("paymentGatewayApiKey", e.target.value)}
                      type="password"
                    />
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Important</AlertTitle>
                    <AlertDescription>
                      This is a demo integration. No actual payments will be processed in this system.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DashboardShell>
    </DashboardLayout>
  )
}
