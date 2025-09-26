"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@smm/ui-core/components/table"
import {
  Search,
  Home,
  Building,
  School,
  Users,
  MapPin,
  Activity,
  Scale,
} from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Label } from "recharts"
import { Currency } from "@/components/currency"

// Sample data for all customers across all grids
const allCustomers = [
  // Ngwerere I customers
  {
    id: "CUST-001",
    name: "Agness Banda",
    type: "residential",
    gridId: "ngwerere-i",
    gridName: "Ngwerere I",
    image: "/images/customers/Agness Banda 1 - Admire Ncube.jpeg",
    lastPurchase: "2024-01-15",
    balance: 45.50,
    location: "Ngwerere, Zambia"
  },
  {
    id: "CUST-002", 
    name: "ANeli Zulu",
    type: "residential",
    gridId: "ngwerere-i",
    gridName: "Ngwerere I",
    image: "/images/customers/ANeli Zulu.jpeg",
    lastPurchase: "2024-01-14",
    balance: 32.75,
    location: "Ngwerere, Zambia"
  },
  {
    id: "CUST-003",
    name: "Beatrice Tembo",
    type: "commercial",
    gridId: "ngwerere-i",
    gridName: "Ngwerere I",
    image: "/images/customers/beatrice tembo - Robert Munthali.jpeg",
    lastPurchase: "2024-01-13",
    balance: 128.90,
    location: "Ngwerere, Zambia"
  },
  {
    id: "CUST-004",
    name: "Cecillia Miti",
    type: "residential",
    gridId: "ngwerere-i",
    gridName: "Ngwerere I",
    image: "/images/customers/cecillia miti - Robert Munthali.jpeg",
    lastPurchase: "2024-01-12",
    balance: 67.25,
    location: "Ngwerere, Zambia"
  },
  {
    id: "CUST-005",
    name: "Doris Chambwe",
    type: "residential",
    gridId: "ngwerere-i",
    gridName: "Ngwerere I",
    image: "/images/customers/Doris chambwe.jpeg",
    lastPurchase: "2024-01-11",
    balance: 89.00,
    location: "Ngwerere, Zambia"
  },
  // Kamuchanga customers
  {
    id: "CUST-006",
    name: "Elizabeth Njobvu",
    type: "residential",
    gridId: "kamuchanga",
    gridName: "Kamuchanga",
    image: "/images/customers/Elizabeth Njobvu - Admire Ncube.jpeg",
    lastPurchase: "2024-01-10",
    balance: 55.75,
    location: "Kamuchanga, Zambia"
  },
  {
    id: "CUST-007",
    name: "Francis Zulu",
    type: "commercial",
    gridId: "kamuchanga",
    gridName: "Kamuchanga",
    image: "/images/customers/Francis Zulu - Admire Ncube.jpeg",
    lastPurchase: "2024-01-09",
    balance: 156.30,
    location: "Kamuchanga, Zambia"
  },
  {
    id: "CUST-008",
    name: "George Mushashiko",
    type: "institutional",
    gridId: "kamuchanga",
    gridName: "Kamuchanga",
    image: "/images/customers/GEorge Mushashiko.jpeg",
    lastPurchase: "2024-01-08",
    balance: 234.50,
    location: "Kamuchanga, Zambia"
  },
  // Kapiri Mposhi customers
  {
    id: "CUST-009",
    name: "Great Followers of Christ Church",
    type: "institutional",
    gridId: "kapiri-mposhi",
    gridName: "Kapiri Mposhi",
    image: "/images/customers/Great Followers of Christ church - Admire Ncube.jpeg",
    lastPurchase: "2024-01-07",
    balance: 189.75,
    location: "Kapiri Mposhi, Zambia"
  },
  {
    id: "CUST-010",
    name: "John Daka",
    type: "residential",
    gridId: "kapiri-mposhi",
    gridName: "Kapiri Mposhi",
    image: "/images/customers/john daka - Robert Munthali.jpeg",
    lastPurchase: "2024-01-06",
    balance: 78.25,
    location: "Kapiri Mposhi, Zambia"
  },
  {
    id: "CUST-011",
    name: "Joseph Mwape",
    type: "commercial",
    gridId: "kapiri-mposhi",
    gridName: "Kapiri Mposhi",
    image: "/images/customers/Joseph Mwape - Admire Ncube.jpeg",
    lastPurchase: "2024-01-05",
    balance: 145.60,
    location: "Kapiri Mposhi, Zambia"
  },
  // Ngwerere II customers
  {
    id: "CUST-012",
    name: "Lawrence Mwanza",
    type: "residential",
    gridId: "ngwerere-ii",
    gridName: "Ngwerere II",
    image: "/images/customers/Lawrence Mwanza.jpeg",
    lastPurchase: "2024-01-04",
    balance: 92.40,
    location: "Ngwerere, Zambia"
  },
  {
    id: "CUST-013",
    name: "Michael Liato",
    type: "commercial",
    gridId: "ngwerere-ii",
    gridName: "Ngwerere II",
    image: "/images/customers/Micheal liato - Robert Munthali.jpeg",
    lastPurchase: "2024-01-03",
    balance: 167.85,
    location: "Ngwerere, Zambia"
  },
  {
    id: "CUST-014",
    name: "Rabson Phiri",
    type: "residential",
    gridId: "ngwerere-ii",
    gridName: "Ngwerere II",
    image: "/images/customers/rabson phiri - Robert Munthali.jpeg",
    lastPurchase: "2024-01-02",
    balance: 43.20,
    location: "Ngwerere, Zambia"
  },
  // Undi customers
  {
    id: "CUST-015",
    name: "Simon Nyangu",
    type: "residential",
    gridId: "undi",
    gridName: "Undi",
    image: "/images/customers/Simon Nyangu pic - Robert Munthali.jpeg",
    lastPurchase: "2024-01-01",
    balance: 76.90,
    location: "Undi, Zambia"
  },
  {
    id: "CUST-016",
    name: "Timeo Mutonga",
    type: "commercial",
    gridId: "undi",
    gridName: "Undi",
    image: "/images/customers/timeo mutonga - Robert Munthali.jpeg",
    lastPurchase: "2023-12-31",
    balance: 198.45,
    location: "Undi, Zambia"
  },
  {
    id: "CUST-017",
    name: "Titus Fyantondo",
    type: "institutional",
    gridId: "undi",
    gridName: "Undi",
    image: "/images/customers/Titus fyantondo4.jpeg",
    lastPurchase: "2023-12-30",
    balance: 312.75,
    location: "Undi, Zambia"
  },
  {
    id: "CUST-018",
    name: "Victor Zulu",
    type: "residential",
    gridId: "undi",
    gridName: "Undi",
    image: "/images/customers/victor zulu - large.jpeg",
    lastPurchase: "2023-12-29",
    balance: 58.30,
    location: "Undi, Zambia"
  }
]

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

const getCustomerTypeIcon = (type: string) => {
  switch (type) {
    case "residential":
      return <Home className="h-3 w-3" />
    case "commercial":
      return <Building className="h-3 w-3" />
    case "institutional":
      return <School className="h-3 w-3" />
    default:
      return <Users className="h-3 w-3" />
  }
}

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedGrid, setSelectedGrid] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Calculate customer type breakdown for pie chart
  const customerTypeData = [
    { name: "Residential", value: allCustomers.filter(c => c.type === "residential").length, color: "#3b82f6", fillOpacity: 0.6 },
    { name: "Commercial", value: allCustomers.filter(c => c.type === "commercial").length, color: "#1d4ed8", fillOpacity: 0.6 },
    { name: "Institutional", value: allCustomers.filter(c => c.type === "institutional").length, color: "#1e3a8a", fillOpacity: 0.6 }
  ]

  // Calculate 3-month rolling average data for active vs inactive customers
  const monthlyData = [
    { month: "Oct", active: 12, inactive: 6 },
    { month: "Nov", active: 14, inactive: 4 },
    { month: "Dec", active: 15, inactive: 3 },
    { month: "Jan", active: 16, inactive: 2 }
  ]

  // 3-month outstanding balance data
  const balanceData = [
    { month: "Oct", balance: 1850 },
    { month: "Nov", balance: 2120 },
    { month: "Dec", balance: 2380 },
    { month: "Jan", balance: 2640 }
  ]

  // Calculate current active customers percentage
  const activeCustomers = allCustomers.filter(customer => {
    const lastPurchaseDate = new Date(customer.lastPurchase)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return lastPurchaseDate >= thirtyDaysAgo
  }).length
  
  const activePercentage = Math.round((activeCustomers / allCustomers.length) * 100)

  // Filter customers based on search and filters
  const filteredCustomers = allCustomers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.location.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = selectedType === "all" || customer.type === selectedType
    const matchesGrid = selectedGrid === "all" || customer.gridId === selectedGrid
    
    return matchesSearch && matchesType && matchesGrid
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentCustomers = filteredCustomers.slice(startIndex, endIndex)

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedType, selectedGrid])

  // Get unique grids for filter
  const availableGrids = Array.from(new Set(allCustomers.map(c => c.gridId)))
  const gridNames = {
    "ngwerere-i": "Ngwerere I",
    "kamuchanga": "Kamuchanga", 
    "kapiri-mposhi": "Kapiri Mposhi",
    "ngwerere-ii": "Ngwerere II",
    "undi": "Undi"
  }

  return (
    <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Customers</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="h-[120px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="month" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis hide />
                      <Tooltip 
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload
                            const total = data.active + data.inactive
                            const activePercent = Math.round((data.active / total) * 100)
                            return (
                              <div className="rounded-lg border bg-background p-2 shadow-sm">
                                <div className="grid gap-2">
                                  <div className="flex flex-col">
                                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                                      {label}
                                    </span>
                                    <span className="font-bold text-muted-foreground">
                                      {activePercent}% Active
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="inactive"
                        stackId="1"
                        stroke="#64748b"
                        fill="#94a3b8"
                        fillOpacity={0.2}
                      />
                      <Area
                        type="monotone"
                        dataKey="active"
                        stackId="1"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-xs text-muted-foreground">
                    Current: {activePercentage}% active
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                      <span className="text-muted-foreground">Active</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-slate-500"></div>
                      <span className="text-muted-foreground">Inactive</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customer Types</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="relative h-[120px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={customerTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={60}
                        paddingAngle={2}
                        dataKey="value"
                        nameKey="name"
                      >
                        {customerTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={entry.fillOpacity} />
                        ))}
                        <Label
                          content={({ viewBox }) => {
                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                              return (
                                <text
                                  x={viewBox.cx}
                                  y={viewBox.cy}
                                  textAnchor="middle"
                                  dominantBaseline="middle"
                                >
                                  <tspan
                                    x={viewBox.cx}
                                    y={viewBox.cy}
                                    className="fill-foreground text-lg font-bold"
                                  >
                                    {allCustomers.length}
                                  </tspan>
                                  <tspan
                                    x={viewBox.cx}
                                    y={(viewBox.cy || 0) + 16}
                                    className="fill-muted-foreground text-xs"
                                  >
                                    Total
                                  </tspan>
                                </text>
                              )
                            }
                          }}
                        />
                      </Pie>
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload
                            const total = customerTypeData.reduce((sum, item) => sum + item.value, 0)
                            const percentage = Math.round((data.value / total) * 100)
                            return (
                              <div className="rounded-lg border bg-background p-2 shadow-sm" style={{ zIndex: 9999 }}>
                                <div className="grid gap-2">
                                  <div className="flex flex-col">
                                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                                      {data.name}
                                    </span>
                                    <span className="font-bold text-muted-foreground">
                                      {data.value} customers ({percentage}%)
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-center gap-4 mt-2">
                  {customerTypeData.map((entry, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <div 
                        className="h-2 w-2 rounded-full" 
                        style={{ backgroundColor: entry.color }}
                      ></div>
                      <span className="text-xs text-muted-foreground">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Outstanding Balances</CardTitle>
                <Scale className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="h-[120px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={balanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="month" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis hide />
                      <Tooltip 
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload
                            return (
                              <div className="rounded-lg border bg-background p-2 shadow-sm">
                                <div className="grid gap-2">
                                  <div className="flex flex-col">
                                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                                      {label}
                                    </span>
                                    <span className="font-bold text-muted-foreground">
                                      <Currency amount={data.balance} />
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="balance"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-xs text-muted-foreground">
                    Current: <Currency amount={balanceData[balanceData.length - 1].balance} />
                  </div>
                  <div className="text-xs text-green-600 font-medium">
                    +{Math.round(((balanceData[balanceData.length - 1].balance - balanceData[0].balance) / balanceData[0].balance) * 100)}% vs Oct
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>All Customers</CardTitle>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input 
                      placeholder="Search customers..." 
                      className="pl-9 w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Customer Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="institutional">Institutional</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedGrid} onValueChange={setSelectedGrid}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Grid" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Grids</SelectItem>
                      {availableGrids.map(gridId => (
                        <SelectItem key={gridId} value={gridId}>
                          {gridNames[gridId as keyof typeof gridNames]}
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
                      <TableHead>Customer ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Grid</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Last Purchase</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentCustomers.map((customer) => (
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
                              href={`/minigrids/${customer.gridId}/customers/${customer.id}`}
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
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <Link 
                              href={`/minigrids/${customer.gridId}`}
                              className="text-sm hover:underline"
                            >
                              {customer.gridName}
                            </Link>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          <Currency amount={customer.balance} />
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {customer.lastPurchase}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex items-center justify-between px-4 py-4">
                <div className="text-muted-foreground text-sm">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredCustomers.length)} of {filteredCustomers.length} customers
                </div>
                
                {/* Pagination Controls - Centered */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className="w-8 h-8 p-0"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    Export
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
    </SidebarInset>
  )
}
