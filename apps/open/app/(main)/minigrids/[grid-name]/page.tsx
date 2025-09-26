"use client"

import { use, useState } from "react"
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
  Wifi,
  Power,
  FileText,
  User,
  Building,
  Home,
  School,
  Frame,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Plus
} from "lucide-react"
import { ChartPowerSystem } from "@/components/chart-power-system"
import { ChartStackedLoad } from "@/components/chart-stacked-load"
import { ChartMinigridRevenue } from "@/components/chart-minigrid-revenue"
import { GridSettingsButton } from "@/components/minigrids/grid-settings-button"
import { TransactionDetailsDialog } from "@/components/transactions/transaction-details-dialog"
import { Currency } from "@/components/currency"

// Sample grid data - in real app this would come from database
const gridData = {
  "ngwerere-i": {
    id: "ngwerere-i",
    name: "Ngwerere I",
    code: "NGW-001",
    location: "Ngwerere, Zambia",
    status: "active",
    image: "/images/minigrids/Ngwerere_drone.jpg",
    customers: {
      residential: 38,
      commercial: 5,
      institutional: 2,
      total: 45
    },
    notes: "Primary grid serving the Ngwerere community with reliable solar power generation and battery storage.",
    kpis: {
      arpg: 2456,
      arpu: 12.34,
      totalRevenue: 14736,
      uptime: 98.7,
      active: 87.3,
      active3m: 92.1
    },
    connectivity: {
      wifiSim: "MTN-789456123",
      wifiNetwork: "MTN Zambia",
      wifiPlan: "Unlimited Data"
    },
    powerSystem: {
      solarSize: "14 kW",
      inverterOutput: "12 kW",
      batteryCapacity: "30 kWh",
      vrmPortalId: "NGW001-VRM"
    },
    documentation: [
      { name: "Land Use Agreement", url: "/documents/ngwerere-i-land-use.pdf" },
      { name: "Project Permissions", url: "/documents/ngwerere-i-permissions.pdf" },
      { name: "Site Safety Plan", url: "/documents/ngwerere-i-safety.pdf" },
      { name: "As-built Designs", url: "/documents/ngwerere-i-designs.pdf" },
      { name: "Technical Documentation", url: "/documents/ngwerere-i-technical.pdf" }
    ],
    contacts: {
      regionalTechnician: { name: "John Mwape", phone: "+260 97 123 4567" },
      salesAgents: [
        { name: "Mary Banda", phone: "+260 96 234 5678" },
        { name: "Peter Chisenga", phone: "+260 95 345 6789" }
      ],
      localAuthorities: [
        { name: "Chief Ngwerere", phone: "+260 97 456 7890" },
        { name: "District Commissioner", phone: "+260 96 567 8901" }
      ]
    }
  }
}

// Sample activity data
const activities = [
  {
    id: 1,
    type: "grid_online",
    message: "Grid online",
    timestamp: "2m ago",
    status: "success"
  },
  {
    id: 2,
    type: "customer_connected",
    message: "New customer connected",
    timestamp: "1h ago",
    status: "info"
  },
  {
    id: 3,
    type: "energy_peak",
    message: "Energy generation peak",
    timestamp: "3h ago",
    status: "success"
  },
  {
    id: 4,
    type: "battery_charged",
    message: "Battery fully charged",
    timestamp: "5h ago",
    status: "success"
  },
  {
    id: 5,
    type: "payment_received",
    message: "Customer payment received",
    timestamp: "8h ago",
    status: "success"
  },
  {
    id: 6,
    type: "maintenance",
    message: "Scheduled maintenance completed",
    timestamp: "1d ago",
    status: "warning"
  },
  {
    id: 7,
    type: "energy_purchase",
    message: "Customer energy purchase",
    timestamp: "2d ago",
    status: "success"
  },
  {
    id: 8,
    type: "system_check",
    message: "Automated system check completed",
    timestamp: "3d ago",
    status: "info"
  },
  {
    id: 9,
    type: "battery_low",
    message: "Battery charge low warning",
    timestamp: "4d ago",
    status: "warning"
  },
  {
    id: 10,
    type: "customer_disconnected",
    message: "Customer disconnected",
    timestamp: "5d ago",
    status: "info"
  },
  {
    id: 11,
    type: "grid_offline",
    message: "Grid offline for maintenance",
    timestamp: "6d ago",
    status: "warning"
  },
  {
    id: 12,
    type: "grid_online",
    message: "Grid back online",
    timestamp: "6d ago",
    status: "success"
  }
]

// Function to get customer image by name
const getCustomerImage = (customerName: string) => {
  const customer = customers.find(c => c.name === customerName);
  return customer?.image || "/images/customers/default-avatar.png";
};

// Sample transaction data
const transactions = [
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
    customerId: "CUST-002",
    customerName: "ANeli Zulu",
    type: "energy_purchase",
    amount: 32.75,
    timestamp: "2024-01-14 16:45",
    status: "completed"
  },
  {
    id: "TXN-003",
    customerId: "CUST-003",
    customerName: "Beatrice Tembo",
    type: "energy_purchase",
    amount: 128.90,
    timestamp: "2024-01-13 09:15",
    status: "completed"
  },
  {
    id: "TXN-004",
    customerId: "CUST-004",
    customerName: "Cecillia Miti",
    type: "energy_purchase",
    amount: 67.25,
    timestamp: "2024-01-12 11:20",
    status: "pending"
  },
  {
    id: "TXN-005",
    customerId: "CUST-005",
    customerName: "Doris Chambwe",
    type: "energy_purchase",
    amount: 89.40,
    timestamp: "2024-01-11 13:10",
    status: "completed"
  },
  {
    id: "TXN-006",
    customerId: "CUST-006",
    customerName: "Elizabeth Njobvu",
    type: "energy_purchase",
    amount: 156.80,
    timestamp: "2024-01-10 15:30",
    status: "completed"
  },
  {
    id: "TXN-007",
    customerId: "CUST-007",
    customerName: "Francis Zulu",
    type: "energy_purchase",
    amount: 54.30,
    timestamp: "2024-01-09 10:45",
    status: "failed"
  },
  {
    id: "TXN-008",
    customerId: "CUST-008",
    customerName: "George Mushashiko",
    type: "energy_purchase",
    amount: 203.15,
    timestamp: "2024-01-08 12:00",
    status: "completed"
  }
]

// Sample customer data
const customers = [
  {
    id: "CUST-001",
    name: "Agness Banda",
    type: "residential",
    image: "/images/customers/Agness Banda 1 - Admire Ncube.jpeg",
    lastPurchase: "2024-01-15",
    balance: 45.50
  },
  {
    id: "CUST-002", 
    name: "ANeli Zulu",
    type: "residential",
    image: "/images/customers/ANeli Zulu.jpeg",
    lastPurchase: "2024-01-14",
    balance: 32.75
  },
  {
    id: "CUST-003",
    name: "Beatrice Tembo",
    type: "commercial",
    image: "/images/customers/beatrice tembo - Robert Munthali.jpeg",
    lastPurchase: "2024-01-13",
    balance: 128.90
  },
  {
    id: "CUST-004",
    name: "Cecillia Miti",
    type: "residential",
    image: "/images/customers/cecillia miti - Robert Munthali.jpeg",
    lastPurchase: "2024-01-12",
    balance: 67.25
  },
  {
    id: "CUST-005",
    name: "Doris Chambwe",
    type: "residential",
    image: "/images/customers/Doris chambwe.jpeg",
    lastPurchase: "2024-01-11",
    balance: 89.40
  },
  {
    id: "CUST-006",
    name: "Elizabeth Njobvu",
    type: "institutional",
    image: "/images/customers/Elizabeth Njobvu - Admire Ncube.jpeg",
    lastPurchase: "2024-01-10",
    balance: 156.80
  },
  {
    id: "CUST-007",
    name: "Francis Zulu",
    type: "residential",
    image: "/images/customers/Francis Zulu - Admire Ncube.jpeg",
    lastPurchase: "2024-01-09",
    balance: 54.30
  },
  {
    id: "CUST-008",
    name: "George Mushashiko",
    type: "commercial",
    image: "/images/customers/GEorge Mushashiko.jpeg",
    lastPurchase: "2024-01-08",
    balance: 203.15
  },
  {
    id: "CUST-009",
    name: "Great Followers of Christ Church",
    type: "institutional",
    image: "/images/customers/Great Followers of Christ church - Admire Ncube.jpeg",
    lastPurchase: "2024-01-07",
    balance: 78.60
  },
  {
    id: "CUST-010",
    name: "John Daka",
    type: "residential",
    image: "/images/customers/john daka - Robert Munthali.jpeg",
    lastPurchase: "2024-01-06",
    balance: 41.85
  }
]

const getCustomerTypeIcon = (type: string) => {
  switch (type) {
    case "residential":
      return <Home className="h-4 w-4" />
    case "commercial":
      return <Building className="h-4 w-4" />
    case "institutional":
      return <School className="h-4 w-4" />
    default:
      return <User className="h-4 w-4" />
  }
}

const getCustomerTypeColor = (type: string) => {
  switch (type) {
    case "residential":
      return "bg-blue-100 text-blue-800"
    case "commercial":
      return "bg-green-100 text-green-800"
    case "institutional":
      return "bg-purple-100 text-purple-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

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
  }>
}

export default function GridPage({ params }: PageProps) {
  const resolvedParams = use(params)
  const gridName = resolvedParams["grid-name"]
  const grid = gridData[gridName as keyof typeof gridData]
  
  // State for customer search
  const [customerSearchTerm, setCustomerSearchTerm] = useState("")
  
  // State for transaction search
  const [transactionSearchTerm, setTransactionSearchTerm] = useState("")

  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
                         customer.id.toLowerCase().includes(customerSearchTerm.toLowerCase())
    return matchesSearch
  })

  // Filter transactions based on search term
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.customerName.toLowerCase().includes(transactionSearchTerm.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(transactionSearchTerm.toLowerCase())
    return matchesSearch
  })

  if (!grid) {
    return (
      <SidebarInset>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold">Grid Not Found</h1>
          <p className="text-muted-foreground mt-2">The requested grid could not be found.</p>
          <Link href="/minigrids">
            <Button className="mt-4">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Minigrids
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
                  <BreadcrumbPage>{grid.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto px-4">
            <GridSettingsButton />
          </div>
        </header>
        
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* Grid Overview */}
          <div className="grid gap-4 md:grid-cols-3">
            {/* Grid Image with Overlay */}
            <div className="md:col-span-2 rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
              <div className="aspect-[3/1] relative overflow-hidden">
                <Image
                  src={grid.image}
                  alt={`${grid.name} installation`}
                  fill
                  className="object-cover"
                />
                {/* Overlay with title and location */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h1 className="text-2xl font-bold">{grid.name}</h1>
                  <p className="text-sm opacity-90">
                    {grid.code} • 
                    <a 
                      href={`https://maps.google.com/?q=-15.4167,28.2833`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline ml-1"
                    >
                      -15.4167, 28.2833
                    </a>
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge 
                      className={grid.status === "active" ? "bg-green-500 hover:bg-green-600 text-white" : ""}
                      variant={grid.status === "active" ? "default" : "secondary"}
                    >
                      {grid.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1">
                        <Home className="h-3 w-3" />
                        {grid.customers.residential}
                      </span>
                      <span className="flex items-center gap-1">
                        <Building className="h-3 w-3" />
                        {grid.customers.commercial}
                      </span>
                      <span className="flex items-center gap-1">
                        <School className="h-3 w-3" />
                        {grid.customers.institutional}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-3">
                <h3 className="text-sm font-semibold mb-1">Grid Overview</h3>
                <p className="text-xs text-muted-foreground">{grid.notes}</p>
              </div>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-[200px] overflow-y-auto space-y-3 pr-2">
                  {activities.map((activity) => (
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

          {/* KPIs */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium">ARPG</h3>
                <Frame className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  <Currency amount={grid.kpis.arpg} decimals={0} />
                </div>
                <p className="text-xs text-muted-foreground">
                  1 month rolling avg
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
                  <Currency amount={grid.kpis.arpu} />
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
                  <Currency amount={grid.kpis.totalRevenue} decimals={0} />
                </div>
                <p className="text-xs text-muted-foreground">
                  This month
                </p>
              </div>
            </div>
            
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium">% Uptime</h3>
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
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12,6 12,12 16,14" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold">{grid.kpis.uptime}%</div>
                <p className="text-xs text-muted-foreground">
                  1 month rolling avg
                </p>
              </div>
            </div>
            
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium">% Active</h3>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <div className="text-2xl font-bold">{grid.kpis.active}%</div>
                <p className="text-xs text-muted-foreground">
                  Used energy this month
                </p>
              </div>
            </div>
            
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium">% Active 3M</h3>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <div className="text-2xl font-bold">{grid.kpis.active3m}%</div>
                <p className="text-xs text-muted-foreground">
                  Purchased in 3 months
                </p>
              </div>
            </div>
          </div>

          {/* Charts and Grid Information */}
          <Tabs defaultValue="charts" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="charts">Charts</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="grid-info">Grid Information</TabsTrigger>
            </TabsList>

            <TabsContent value="charts" className="space-y-4">
              {/* Total Revenue Chart */}
              <Card>
                <CardContent>
                  <ChartMinigridRevenue />
                </CardContent>
              </Card>

              {/* Power System Chart */}
              <Card>
                <CardContent>
                  <ChartPowerSystem />
                </CardContent>
              </Card>

              {/* Aggregate Load Profile Chart */}
              <Card>
                <CardContent>
                  <ChartStackedLoad />
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
                        value={transactionSearchTerm}
                        onChange={(e) => setTransactionSearchTerm(e.target.value)}
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
                          <TableHead>Customer</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTransactions.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell className="font-medium">
                              <TransactionDetailsDialog transaction={transaction} />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="relative w-8 h-8 rounded-full overflow-hidden">
                                  <Image
                                    src={getCustomerImage(transaction.customerName)}
                                    alt={transaction.customerName}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <Link 
                                  href={`/minigrids/${gridName}/customers/${transaction.customerId}`}
                                  className="hover:underline"
                                >
                                  {transaction.customerName}
                                </Link>
                              </div>
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
                      Showing {transactions.length} transactions
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

            <TabsContent value="grid-info" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Connectivity Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wifi className="h-5 w-5" />
                      Connectivity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">WiFi SIM #</label>
                      <p className="text-sm text-muted-foreground">{grid.connectivity.wifiSim}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">WiFi Network</label>
                      <p className="text-sm text-muted-foreground">{grid.connectivity.wifiNetwork}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">WiFi Plan</label>
                      <p className="text-sm text-muted-foreground">{grid.connectivity.wifiPlan}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Power System Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Power className="h-5 w-5" />
                      Power System
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Solar Size</label>
                      <p className="text-sm text-muted-foreground">{grid.powerSystem.solarSize}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Inverter Output</label>
                      <p className="text-sm text-muted-foreground">{grid.powerSystem.inverterOutput}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Battery Capacity</label>
                      <p className="text-sm text-muted-foreground">{grid.powerSystem.batteryCapacity}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">VRM Portal ID</label>
                      <p className="text-sm text-muted-foreground">{grid.powerSystem.vrmPortalId}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Documentation */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Documentation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {grid.documentation.map((doc, index) => (
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

                {/* Local Contacts */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="h-5 w-5" />
                      Local Contacts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Regional Technician</label>
                      <div className="flex items-center gap-2 mt-1">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{grid.contacts.regionalTechnician.name}</span>
                        <span className="text-sm text-muted-foreground">{grid.contacts.regionalTechnician.phone}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Sales Agents</label>
                      <div className="space-y-1 mt-1">
                        {grid.contacts.salesAgents.map((agent, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{agent.name}</span>
                            <span className="text-sm text-muted-foreground">{agent.phone}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Local Authorities</label>
                      <div className="space-y-1 mt-1">
                        {grid.contacts.localAuthorities.map((authority, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{authority.name}</span>
                            <span className="text-sm text-muted-foreground">{authority.phone}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="customers" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Customers</CardTitle>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input 
                          placeholder="Search customers..." 
                          className="pl-9 w-64"
                          value={customerSearchTerm}
                          onChange={(e) => setCustomerSearchTerm(e.target.value)}
                        />
                      </div>
                      <Button>
                        <Plus className="h-4 w-4 mr-0" />
                        Add Customer(s)
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>User ID</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Balance</TableHead>
                          <TableHead>Last Purchase</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCustomers.map((customer) => (
                          <TableRow key={customer.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="relative w-8 h-8 rounded-full overflow-hidden">
                                  <Image
                                    src={customer.image}
                                    alt={customer.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <Link 
                                  href={`/minigrids/${gridName}/customers/${customer.id}`}
                                  className="font-medium hover:underline"
                                >
                                  {customer.name}
                                </Link>
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground">{customer.id}</TableCell>
                            <TableCell>
                              <Badge className={getCustomerTypeColor(customer.type)}>
                                {getCustomerTypeIcon(customer.type)}
                                <span className="ml-1 capitalize">{customer.type}</span>
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Currency amount={customer.balance} />
                            </TableCell>
                            <TableCell className="text-muted-foreground">{customer.lastPurchase}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="flex items-center justify-between px-4 py-4">
                    <div className="text-muted-foreground text-sm">
                      Showing {customers.length} customers
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="rows-per-page" className="text-sm font-medium">
                        Rows per page
                      </Label>
                      <Select defaultValue="10">
                        <SelectTrigger className="w-20" id="rows-per-page">
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
          </Tabs>
        </div>
    </SidebarInset>
  )
}
