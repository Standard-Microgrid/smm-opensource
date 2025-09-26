"use client"

import { use } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@smm/ui-core"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@smm/ui-core"
import { 
  Activity, 
  Download,
  Phone,
  Mail,
  Power,
  FileText,
  Home,
  ArrowUpDown,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Calendar,
  Zap,
  CreditCard,
  ShoppingCart
} from "lucide-react"
import { ChartCustomerUsage } from "@/components/chart-customer-usage"
import { CustomerSettingsButton } from "@/components/customers/customer-settings-button"
import { TransactionDetailsDialog } from "@/components/transactions/transaction-details-dialog"
import { Currency } from "@/components/currency"

// Sample customer data - in real app this would come from database
const customerData = {
  "CUST-001": {
    id: "CUST-001",
    name: "Agness Banda",
    gridName: "Ngwerere I",
    gridId: "ngwerere-i",
    type: "residential",
    image: "/images/customers/Agness Banda XL.jpeg",
    status: "active",
    notes: "Reliable customer with consistent energy usage patterns. Lives in the Ngwerere community with family.",
    kpis: {
      currentBalance: 45.50,
      arpu: 12.34,
      totalRevenue: 147.36,
      daysActive: 87.3,
      avgDailyConsumption: 2.8,
      purchases3M: 12
    },
    contactInfo: {
      email: "agness.banda@email.com",
      phone: "+260 97 123 4567"
    },
    connectionInfo: {
      meterNumber: "NGW-001-001",
      connectionDate: "2023-03-15",
      meterType: "Smart Prepaid"
    },
    location: {
      coordinates: {
        lat: -15.4167,
        lng: 28.2833
      }
    },
    documentation: [
      { name: "Customer Agreement", url: "/documents/customers/agness-banda-agreement.pdf" },
      { name: "Connection Certificate", url: "/documents/customers/agness-banda-connection.pdf" },
      { name: "Meter Installation Report", url: "/documents/customers/agness-banda-meter-install.pdf" },
      { name: "Safety Inspection", url: "/documents/customers/agness-banda-safety.pdf" },
      { name: "Payment History", url: "/documents/customers/agness-banda-payments.pdf" }
    ]
  }
}

// Sample activity data for this customer
const customerActivities = [
  {
    id: 1,
    type: "energy_purchase",
    message: "Energy purchase completed",
    timestamp: "2h ago",
    status: "success"
  },
  {
    id: 2,
    type: "payment_received",
    message: "Payment received",
    timestamp: "1d ago",
    status: "success"
  },
  {
    id: 3,
    type: "high_usage",
    message: "High energy consumption detected",
    timestamp: "2d ago",
    status: "warning"
  },
  {
    id: 4,
    type: "energy_purchase",
    message: "Energy purchase completed",
    timestamp: "3d ago",
    status: "success"
  },
  {
    id: 5,
    type: "low_balance",
    message: "Low balance warning sent",
    timestamp: "5d ago",
    status: "info"
  },
  {
    id: 6,
    type: "energy_purchase",
    message: "Energy purchase completed",
    timestamp: "1w ago",
    status: "success"
  }
]

// Sample transaction data for this specific customer
const customerTransactions = [
  {
    id: "TXN-001",
    customerId: "CUST-001",
    customerName: "Agness Banda",
    type: "energy_purchase",
    amount: 45.50,
    timestamp: "2024-01-15 14:30",
    status: "completed"
  },
  {
    id: "TXN-002",
    customerId: "CUST-001",
    customerName: "Agness Banda",
    type: "energy_purchase",
    amount: 32.75,
    timestamp: "2024-01-12 16:45",
    status: "completed"
  },
  {
    id: "TXN-003",
    customerId: "CUST-001",
    customerName: "Agness Banda",
    type: "energy_purchase",
    amount: 28.90,
    timestamp: "2024-01-09 09:15",
    status: "completed"
  },
  {
    id: "TXN-004",
    customerId: "CUST-001",
    customerName: "Agness Banda",
    type: "energy_purchase",
    amount: 40.25,
    timestamp: "2024-01-06 11:20",
    status: "completed"
  },
  {
    id: "TXN-005",
    customerId: "CUST-001",
    customerName: "Agness Banda",
    type: "energy_purchase",
    amount: 35.40,
    timestamp: "2024-01-03 13:10",
    status: "completed"
  }
]

const getActivityStatusColor = (status: string) => {
  switch (status) {
    case "success":
      return "bg-green-500"
    case "warning":
      return "bg-yellow-500"
    case "error":
      return "bg-red-500"
    case "info":
      return "bg-blue-500"
    default:
      return "bg-gray-500"
  }
}

const getTransactionStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800"
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "failed":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

interface PageProps {
  params: Promise<{
    "grid-name": string
    "customer-name": string
  }>
}

export default function CustomerPage({ params }: PageProps) {
  const resolvedParams = use(params)
  const gridName = resolvedParams["grid-name"]
  const customerName = resolvedParams["customer-name"]
  const customer = customerData[customerName as keyof typeof customerData]

  if (!customer) {
    return (
      <SidebarInset>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold">Customer Not Found</h1>
          <p className="text-muted-foreground mt-2">The requested customer could not be found.</p>
          <Link href={`/minigrids/${gridName}`}>
            <Button className="mt-4">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Grid
            </Button>
          </Link>
        </div>
      </div>
      </SidebarInset>
    )
  }

  return (
    <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/minigrids">Minigrids</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/minigrids/${customer.gridId}`}>{customer.gridName}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage>{customer.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto px-4">
            <CustomerSettingsButton />
          </div>
        </header>
        
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* Customer Overview */}
          <div className="flex gap-4">
            {/* Customer Image with Overlay */}
            <div className="flex-1 rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
              <div className="flex h-[300px]">
                {/* Left side - Image */}
                <div className="w-1/2 relative overflow-hidden">
                  <Image
                    src={customer.image}
                    alt={`${customer.name} customer photo`}
                    fill
                    className="object-cover"
                    style={{ objectPosition: 'center 30%' }}
                  />
                </div>
                
                {/* Right side - Customer Overview */}
                <div className="w-1/2 p-4 flex flex-col justify-between">
                  <div>
                    <h1 className="text-xl font-bold mb-2">{customer.name}</h1>
                    <p className="text-sm text-muted-foreground mb-2">
                      {customer.connectionInfo.meterNumber} • {customer.gridName}
                    </p>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge 
                        className={customer.status === "active" ? "bg-green-500 hover:bg-green-600 text-white" : ""}
                        variant={customer.status === "active" ? "default" : "secondary"}
                      >
                        {customer.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2 text-xs">
                        <Home className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground capitalize">{customer.type}</span>
                        <span className="text-muted-foreground">•</span>
                        <a 
                          href={`https://maps.google.com/?q=${customer.location.coordinates.lat},${customer.location.coordinates.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground hover:underline"
                        >
                          {customer.location.coordinates.lat}, {customer.location.coordinates.lng}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Connected: {new Date(customer.connectionInfo.connectionDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-sm font-semibold mb-2">Customer Notes</h3>
                    <p className="text-xs text-muted-foreground">{customer.notes}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="w-80">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-h-[200px] overflow-y-auto space-y-3 pr-2">
                    {customerActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${getActivityStatusColor(activity.status)}`}></div>
                        <div className="flex-1 space-y-1">
                          <p className="text-xs text-muted-foreground">{activity.message}</p>
                          <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

          </div>

          {/* KPIs */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium">Current Balance</h3>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  <Currency amount={customer.kpis.currentBalance} />
                </div>
                <p className="text-xs text-muted-foreground">
                  Available credit
                </p>
              </div>
            </div>
            
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium">ARPU</h3>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  <Currency amount={customer.kpis.arpu} />
                </div>
                <p className="text-xs text-muted-foreground">
                  1 month rolling avg
                </p>
              </div>
            </div>
            
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium">Total Revenue</h3>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <line x1="12" x2="12" y1="2" y2="22" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  <Currency amount={customer.kpis.totalRevenue} decimals={0} />
                </div>
                <p className="text-xs text-muted-foreground">
                  This month
                </p>
              </div>
            </div>
            
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium">% Days Active</h3>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <div className="text-2xl font-bold">{customer.kpis.daysActive}%</div>
                <p className="text-xs text-muted-foreground">
                  1 month rolling avg
                </p>
              </div>
            </div>
            
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium">Usage</h3>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <div className="text-2xl font-bold">{customer.kpis.avgDailyConsumption} kWh</div>
                <p className="text-xs text-muted-foreground">
                  Daily average
                </p>
              </div>
            </div>
            
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium"># Purchases</h3>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <div className="text-2xl font-bold">{customer.kpis.purchases3M}</div>
                <p className="text-xs text-muted-foreground">
                  Last 3 months
                </p>
              </div>
            </div>
          </div>

          {/* Charts and Customer Information */}
          <Tabs defaultValue="charts" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="charts">Charts</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="customer-info">Customer Information</TabsTrigger>
            </TabsList>

            <TabsContent value="charts" className="space-y-4">
              {/* Customer Usage Chart */}
              <Card>
                <CardContent>
                  <ChartCustomerUsage />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transactions" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Transactions</CardTitle>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input 
                        placeholder="Search transactions..." 
                        className="pl-9 w-64"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Transaction ID</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>
                            <Button variant="ghost" size="sm" className="h-8 px-2 lg:px-3">
                              Amount
                              <ArrowUpDown className="ml-2 h-4 w-4" />
                            </Button>
                          </TableHead>
                          <TableHead>
                            <Button variant="ghost" size="sm" className="h-8 px-2 lg:px-3">
                              Date
                              <ArrowUpDown className="ml-2 h-4 w-4" />
                            </Button>
                          </TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {customerTransactions.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell className="font-medium">
                              <TransactionDetailsDialog transaction={transaction} />
                            </TableCell>
                            <TableCell className="text-muted-foreground">Energy Purchase</TableCell>
                            <TableCell>
                              <Currency amount={transaction.amount} />
                            </TableCell>
                            <TableCell className="text-muted-foreground">{transaction.timestamp}</TableCell>
                            <TableCell>
                              <Badge className={getTransactionStatusColor(transaction.status)}>
                                {transaction.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="flex items-center justify-between px-4 py-4">
                    <div className="text-muted-foreground text-sm">
                      Showing {customerTransactions.length} transactions
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="rows-per-page-tx" className="text-sm font-medium">
                        Rows per page
                      </Label>
                      <Select defaultValue="10">
                        <SelectTrigger className="w-20" id="rows-per-page-tx">
                          <SelectValue placeholder="10" />
                        </SelectTrigger>
                        <SelectContent side="top">
                          {[10, 20, 30, 40, 50].map((pageSize) => (
                            <SelectItem key={pageSize} value={`${pageSize}`}>
                              {pageSize}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <ChevronsLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm font-medium">Page 1 of 1</span>
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <ChevronsRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="customer-info" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="h-5 w-5" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <div className="flex items-center gap-2 mt-1">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{customer.contactInfo.email}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Phone</label>
                      <div className="flex items-center gap-2 mt-1">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{customer.contactInfo.phone}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Connection Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Power className="h-5 w-5" />
                      Connection Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Meter Number</label>
                      <p className="text-sm text-muted-foreground">{customer.connectionInfo.meterNumber}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Connection Date</label>
                      <p className="text-sm text-muted-foreground">
                        {new Date(customer.connectionInfo.connectionDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Meter Type</label>
                      <p className="text-sm text-muted-foreground">{customer.connectionInfo.meterType}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Customer Documentation */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Documentation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {customer.documentation.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm">{doc.name}</span>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
    </SidebarInset>
  )
}
