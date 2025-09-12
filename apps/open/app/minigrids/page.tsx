"use client"

import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Plus, 
  ChevronRight,
  MapPin,
  Zap,
  Users,
  Activity
} from "lucide-react"

// Sample minigrid data with placeholder images
const minigrids = [
  {
    id: "ngwerere-i",
    name: "Ngwerere I",
    location: "Ngwerere, Zambia",
    status: "active",
    customers: 45,
    capacity: "14 kW",
    storage: "30 kWh",
    image: "/images/minigrids/Ngwerere_drone.jpg", // User uploaded image
    lastUpdated: "2 hours ago"
  },
  {
    id: "ngwerere-ii",
    name: "Ngwerere II",
    location: "Ngwerere, Zambia", 
    status: "active",
    customers: 38,
    capacity: "13 kW",
    storage: "20 kWh",
    image: "/images/minigrids/Ngwerere_drone.jpg", // User uploaded image
    lastUpdated: "1 hour ago"
  },
  {
    id: "kamuchanga",
    name: "Kamuchanga",
    location: "Kamuchanga, Zambia",
    status: "maintenance",
    customers: 42,
    capacity: "14 kW", 
    storage: "25 kWh",
    image: "/images/minigrids/kam_small2.jpg", // User uploaded image
    lastUpdated: "4 hours ago"
  },
  {
    id: "undi",
    name: "Undi",
    location: "Undi, Zambia",
    status: "active",
    customers: 39,
    capacity: "14 kW",
    storage: "25 kWh",
    image: "/images/minigrids/DJI_0301a_resized.jpg", // User uploaded image
    lastUpdated: "1 day ago"
  },
  {
    id: "chapita",
    name: "Chapita", 
    location: "Chapita, Zambia",
    status: "active",
    customers: 41,
    capacity: "14 kW",
    storage: "25 kWh",
    image: "/images/minigrids/DJI_0832_1.jpg", // User uploaded image
    lastUpdated: "3 hours ago"
  },
  {
    id: "kapiri-mposhi",
    name: "Kapiri Mposhi",
    location: "Kapiri Mposhi, Zambia",
    status: "active", 
    customers: 43,
    capacity: "14 kW",
    storage: "25 kWh",
    image: "/images/minigrids/Kitewele.jpg", // User uploaded image
    lastUpdated: "30 minutes ago"
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-500"
    case "maintenance":
      return "bg-yellow-500"
    case "inactive":
      return "bg-gray-400"
    default:
      return "bg-gray-400"
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case "active":
      return "Active"
    case "maintenance":
      return "Maintenance"
    case "inactive":
      return "Inactive"
    default:
      return "Unknown"
  }
}

export default function MinigridsPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
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
                  <BreadcrumbPage>Minigrids</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* Search and Filter Bar */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search for a minigrid..." 
                className="pl-9"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <div className="flex items-center border rounded-md">
              <Button variant="ghost" size="sm" className="rounded-r-none">
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="rounded-l-none border-l">
                <List className="h-4 w-4" />
              </Button>
            </div>
            <Button className="gap-2 ml-auto">
              <Plus className="h-4 w-4" />
              New Minigrid
            </Button>
          </div>

          {/* Minigrid Cards Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {minigrids.map((grid) => (
              <div
                key={grid.id}
                className="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md cursor-pointer"
              >
                {/* Grid Image */}
                <div className="aspect-video bg-muted relative overflow-hidden">
                  <img
                    src={grid.image}
                    alt={`${grid.name} installation`}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    onError={(e) => {
                      // Fallback to a placeholder if image fails to load
                      e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236b7280' font-family='system-ui' font-size='14'%3E%3Cimage%3E%3C/text%3E%3C/svg%3E"
                    }}
                  />
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(grid.status)}`}>
                      <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                      {getStatusText(grid.status)}
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 space-y-3">
                  <div className="space-y-1">
                    <h3 className="font-semibold leading-none tracking-tight">
                      {grid.name}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {grid.location}
                    </div>
                  </div>

                  {/* Grid Stats */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{grid.customers}</div>
                        <div className="text-xs text-muted-foreground">Customers</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{grid.capacity} | {grid.storage}</div>
                        <div className="text-xs text-muted-foreground">Capacity</div>
                      </div>
                    </div>
                  </div>

                  {/* Last Updated */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Activity className="h-3 w-3" />
                    Updated {grid.lastUpdated}
                  </div>
                </div>

                {/* Hover Arrow */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
