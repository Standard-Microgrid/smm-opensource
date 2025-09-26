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
import DateRangePicker from "@smm/ui-core/components/date-picker"
import {
  Search,
  DollarSign,
  CreditCard,
  MapPin,
  ShoppingCart,
} from "lucide-react"
import { TransactionDetailsDialog } from "@/components/transactions/transaction-details-dialog"
import { Currency } from "@/components/currency"

// Sample transaction data
const allTransactions = [
  {
    id: "TXN-001",
    customerId: "CUST-001",
    customerName: "Agness Banda",
    customerImage: "/images/customers/Agness Banda 1 - Admire Ncube.jpeg",
    gridId: "ngwerere-i",
    gridName: "Ngwerere I",
    type: "energy_purchase",
    amount: 45.50,
    timestamp: "2024-01-15 14:30",
    date: new Date("2024-01-15"),
    status: "completed"
  },
  {
    id: "TXN-002",
    customerId: "CUST-002",
    customerName: "ANeli Zulu",
    customerImage: "/images/customers/ANeli Zulu.jpeg",
    gridId: "ngwerere-i",
    gridName: "Ngwerere I",
    type: "energy_purchase",
    amount: 32.75,
    timestamp: "2024-01-14 16:45",
    date: new Date("2024-01-14"),
    status: "completed"
  },
  {
    id: "TXN-003",
    customerId: "CUST-003",
    customerName: "Beatrice Tembo",
    customerImage: "/images/customers/beatrice tembo - Robert Munthali.jpeg",
    gridId: "ngwerere-i",
    gridName: "Ngwerere I",
    type: "energy_purchase",
    amount: 128.90,
    timestamp: "2024-01-13 09:15",
    date: new Date("2024-01-13"),
    status: "completed"
  },
  {
    id: "TXN-004",
    customerId: "CUST-004",
    customerName: "Cecillia Miti",
    customerImage: "/images/customers/cecillia miti - Robert Munthali.jpeg",
    gridId: "ngwerere-i",
    gridName: "Ngwerere I",
    type: "energy_purchase",
    amount: 67.25,
    timestamp: "2024-01-12 11:20",
    date: new Date("2024-01-12"),
    status: "completed"
  },
  {
    id: "TXN-005",
    customerId: "CUST-005",
    customerName: "Doris Chambwe",
    customerImage: "/images/customers/Doris chambwe.jpeg",
    gridId: "ngwerere-i",
    gridName: "Ngwerere I",
    type: "energy_purchase",
    amount: 89.00,
    timestamp: "2024-01-11 08:30",
    date: new Date("2024-01-11"),
    status: "completed"
  },
  {
    id: "TXN-006",
    customerId: "CUST-006",
    customerName: "Elizabeth Njobvu",
    customerImage: "/images/customers/Elizabeth Njobvu - Admire Ncube.jpeg",
    gridId: "kamuchanga",
    gridName: "Kamuchanga",
    type: "energy_purchase",
    amount: 55.75,
    timestamp: "2024-01-10 15:45",
    date: new Date("2024-01-10"),
    status: "completed"
  },
  {
    id: "TXN-007",
    customerId: "CUST-007",
    customerName: "Francis Zulu",
    customerImage: "/images/customers/Francis Zulu - Admire Ncube.jpeg",
    gridId: "kamuchanga",
    gridName: "Kamuchanga",
    type: "energy_purchase",
    amount: 156.30,
    timestamp: "2024-01-09 12:10",
    date: new Date("2024-01-09"),
    status: "completed"
  },
  {
    id: "TXN-008",
    customerId: "CUST-008",
    customerName: "George Mushashiko",
    customerImage: "/images/customers/GEorge Mushashiko.jpeg",
    gridId: "kamuchanga",
    gridName: "Kamuchanga",
    type: "energy_purchase",
    amount: 234.50,
    timestamp: "2024-01-08 09:25",
    date: new Date("2024-01-08"),
    status: "completed"
  },
  {
    id: "TXN-009",
    customerId: "CUST-009",
    customerName: "Great Followers of Christ Church",
    customerImage: "/images/customers/Great Followers of Christ church - Admire Ncube.jpeg",
    gridId: "kapiri-mposhi",
    gridName: "Kapiri Mposhi",
    type: "energy_purchase",
    amount: 189.75,
    timestamp: "2024-01-07 16:00",
    date: new Date("2024-01-07"),
    status: "completed"
  },
  {
    id: "TXN-010",
    customerId: "CUST-010",
    customerName: "John Daka",
    customerImage: "/images/customers/john daka - Robert Munthali.jpeg",
    gridId: "kapiri-mposhi",
    gridName: "Kapiri Mposhi",
    type: "energy_purchase",
    amount: 78.25,
    timestamp: "2024-01-06 13:30",
    date: new Date("2024-01-06"),
    status: "completed"
  },
  {
    id: "TXN-011",
    customerId: "CUST-011",
    customerName: "Joseph Mwape",
    customerImage: "/images/customers/Joseph Mwape - Admire Ncube.jpeg",
    gridId: "kapiri-mposhi",
    gridName: "Kapiri Mposhi",
    type: "energy_purchase",
    amount: 145.60,
    timestamp: "2024-01-05 10:15",
    date: new Date("2024-01-05"),
    status: "completed"
  },
  {
    id: "TXN-012",
    customerId: "CUST-012",
    customerName: "Lawrence Mwanza",
    customerImage: "/images/customers/Lawrence Mwanza.jpeg",
    gridId: "ngwerere-ii",
    gridName: "Ngwerere II",
    type: "energy_purchase",
    amount: 92.40,
    timestamp: "2024-01-04 14:20",
    date: new Date("2024-01-04"),
    status: "completed"
  },
  {
    id: "TXN-013",
    customerId: "CUST-013",
    customerName: "Michael Liato",
    customerImage: "/images/customers/Micheal liato - Robert Munthali.jpeg",
    gridId: "ngwerere-ii",
    gridName: "Ngwerere II",
    type: "energy_purchase",
    amount: 167.85,
    timestamp: "2024-01-03 11:45",
    date: new Date("2024-01-03"),
    status: "completed"
  },
  {
    id: "TXN-014",
    customerId: "CUST-014",
    customerName: "Rabson Phiri",
    customerImage: "/images/customers/rabson phiri - Robert Munthali.jpeg",
    gridId: "ngwerere-ii",
    gridName: "Ngwerere II",
    type: "energy_purchase",
    amount: 43.20,
    timestamp: "2024-01-02 17:30",
    date: new Date("2024-01-02"),
    status: "completed"
  },
  {
    id: "TXN-015",
    customerId: "CUST-015",
    customerName: "Simon Nyangu",
    customerImage: "/images/customers/Simon Nyangu pic - Robert Munthali.jpeg",
    gridId: "undi",
    gridName: "Undi",
    type: "energy_purchase",
    amount: 76.90,
    timestamp: "2024-01-01 12:00",
    date: new Date("2024-01-01"),
    status: "completed"
  },
  {
    id: "TXN-016",
    customerId: "CUST-016",
    customerName: "Timeo Mutonga",
    customerImage: "/images/customers/timeo mutonga - Robert Munthali.jpeg",
    gridId: "undi",
    gridName: "Undi",
    type: "energy_purchase",
    amount: 198.45,
    timestamp: "2023-12-31 15:15",
    date: new Date("2023-12-31"),
    status: "completed"
  },
  {
    id: "TXN-017",
    customerId: "CUST-017",
    customerName: "Titus Fyantondo",
    customerImage: "/images/customers/Titus fyantondo4.jpeg",
    gridId: "undi",
    gridName: "Undi",
    type: "energy_purchase",
    amount: 312.75,
    timestamp: "2023-12-30 09:45",
    date: new Date("2023-12-30"),
    status: "completed"
  },
  {
    id: "TXN-018",
    customerId: "CUST-018",
    customerName: "Victor Zulu",
    customerImage: "/images/customers/victor zulu - large.jpeg",
    gridId: "undi",
    gridName: "Undi",
    type: "energy_purchase",
    amount: 58.30,
    timestamp: "2023-12-29 16:20",
    date: new Date("2023-12-29"),
    status: "completed"
  }
]

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

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedGrid, setSelectedGrid] = useState("all")
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Native date formatting function
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    })
  }

  // Filter transactions based on search and filters
  const filteredTransactions = allTransactions.filter(transaction => {
    const matchesSearch = transaction.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.gridName.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = selectedStatus === "all" || transaction.status === selectedStatus
    const matchesGrid = selectedGrid === "all" || transaction.gridId === selectedGrid
    
    const matchesFromDate = !dateRange.from || transaction.date >= dateRange.from
    const matchesToDate = !dateRange.to || transaction.date <= dateRange.to
    
    return matchesSearch && matchesStatus && matchesGrid && matchesFromDate && matchesToDate
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex)

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedStatus, selectedGrid, dateRange])

  // Get unique grids for filter
  const availableGrids = Array.from(new Set(allTransactions.map(t => t.gridId)))
  const gridNames = {
    "ngwerere-i": "Ngwerere I",
    "kamuchanga": "Kamuchanga", 
    "kapiri-mposhi": "Kapiri Mposhi",
    "ngwerere-ii": "Ngwerere II",
    "undi": "Undi"
  }

  // Calculate totals
  const totalRevenue = filteredTransactions.reduce((sum, transaction) => sum + transaction.amount, 0)
  const totalTransactions = filteredTransactions.length
  const averageTransaction = totalTransactions > 0 ? totalRevenue / totalTransactions : 0

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
                  <BreadcrumbPage>Transactions</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium">Total Revenue</h3>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  <Currency amount={totalRevenue} decimals={0} />
                </div>
                <p className="text-xs text-muted-foreground">
                  From {totalTransactions} filtered transactions
                </p>
              </div>
            </div>
            
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium">Average Transaction</h3>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  <Currency amount={averageTransaction} />
                </div>
                <p className="text-xs text-muted-foreground">
                  Per filtered transaction
                </p>
              </div>
            </div>
            
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium">Total Transactions</h3>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalTransactions}</div>
                <p className="text-xs text-muted-foreground">
                  Currently filtered
                </p>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>All Transactions</CardTitle>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input 
                      placeholder="Search transactions..." 
                      className="pl-9 w-56"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  {/* Date Range Picker */}
                  <DateRangePicker
                    from={dateRange.from}
                    to={dateRange.to}
                    onSelect={(range) => setDateRange(range)}
                    className="w-[260px]"
                  />

                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedGrid} onValueChange={setSelectedGrid}>
                    <SelectTrigger className="w-32">
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
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Grid</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">
                          <TransactionDetailsDialog transaction={transaction} />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="relative w-8 h-8 rounded-full overflow-hidden">
                              <Image
                                src={transaction.customerImage}
                                alt={transaction.customerName}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <Link 
                              href={`/minigrids/${transaction.gridId}/customers/${transaction.customerId}`}
                              className="font-medium hover:underline"
                            >
                              {transaction.customerName}
                            </Link>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <Link 
                              href={`/minigrids/${transaction.gridId}`}
                              className="text-sm hover:underline"
                            >
                              {transaction.gridName}
                            </Link>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          <Currency amount={transaction.amount} />
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(transaction.date)}
                        </TableCell>
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
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredTransactions.length)} of {filteredTransactions.length} transactions
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
