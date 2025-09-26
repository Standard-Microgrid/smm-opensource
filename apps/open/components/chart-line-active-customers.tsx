"use client"

import { useState } from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart"

// Sample data for different time periods - % active customers by grid
const dataByPeriod = {
  "7d": [
    { date: "Jun 24", "Lusaka Central": 87.2, "Kitwe North": 92.1, "Ndola Industrial": 89.5, "Livingstone Resort": 95.3, "Chipata East": 88.7, "Solwezi Mining": 91.4 },
    { date: "Jun 25", "Lusaka Central": 85.8, "Kitwe North": 90.3, "Ndola Industrial": 87.9, "Livingstone Resort": 93.7, "Chipata East": 86.2, "Solwezi Mining": 89.8 },
    { date: "Jun 26", "Lusaka Central": 89.1, "Kitwe North": 94.2, "Ndola Industrial": 91.3, "Livingstone Resort": 96.8, "Chipata East": 90.5, "Solwezi Mining": 93.1 },
    { date: "Jun 27", "Lusaka Central": 91.5, "Kitwe North": 95.7, "Ndola Industrial": 93.2, "Livingstone Resort": 97.4, "Chipata East": 92.8, "Solwezi Mining": 94.6 },
    { date: "Jun 28", "Lusaka Central": 88.3, "Kitwe North": 93.1, "Ndola Industrial": 90.7, "Livingstone Resort": 95.9, "Chipata East": 89.4, "Solwezi Mining": 92.3 },
    { date: "Jun 29", "Lusaka Central": 86.7, "Kitwe North": 91.8, "Ndola Industrial": 89.1, "Livingstone Resort": 94.2, "Chipata East": 87.6, "Solwezi Mining": 90.9 },
    { date: "Jun 30", "Lusaka Central": 92.4, "Kitwe North": 96.3, "Ndola Industrial": 94.1, "Livingstone Resort": 98.1, "Chipata East": 93.7, "Solwezi Mining": 95.2 },
  ],
  "30d": [
    { date: "Jun 1", "Lusaka Central": 87.3, "Kitwe North": 92.1, "Ndola Industrial": 89.5, "Livingstone Resort": 95.3, "Chipata East": 88.7, "Solwezi Mining": 91.4 },
    { date: "Jun 8", "Lusaka Central": 88.1, "Kitwe North": 93.2, "Ndola Industrial": 90.3, "Livingstone Resort": 96.1, "Chipata East": 89.4, "Solwezi Mining": 92.6 },
    { date: "Jun 15", "Lusaka Central": 86.8, "Kitwe North": 91.7, "Ndola Industrial": 88.9, "Livingstone Resort": 94.8, "Chipata East": 87.9, "Solwezi Mining": 90.8 },
    { date: "Jun 22", "Lusaka Central": 89.2, "Kitwe North": 94.5, "Ndola Industrial": 91.7, "Livingstone Resort": 97.2, "Chipata East": 90.3, "Solwezi Mining": 93.4 },
    { date: "Jun 30", "Lusaka Central": 90.7, "Kitwe North": 95.1, "Ndola Industrial": 92.8, "Livingstone Resort": 97.8, "Chipata East": 91.6, "Solwezi Mining": 94.2 },
  ],
  "3m": [
    { date: "Apr", "Lusaka Central": 85.2, "Kitwe North": 90.8, "Ndola Industrial": 87.4, "Livingstone Resort": 93.6, "Chipata East": 86.9, "Solwezi Mining": 89.7 },
    { date: "May", "Lusaka Central": 87.8, "Kitwe North": 92.3, "Ndola Industrial": 89.1, "Livingstone Resort": 95.1, "Chipata East": 88.4, "Solwezi Mining": 91.2 },
    { date: "Jun", "Lusaka Central": 89.1, "Kitwe North": 94.2, "Ndola Industrial": 91.3, "Livingstone Resort": 96.8, "Chipata East": 90.5, "Solwezi Mining": 93.1 },
  ],
}

const chartConfig = {
  "Lusaka Central": {
    label: "Lusaka Central",
    color: "#1e40af", // Blue-800
  },
  "Kitwe North": {
    label: "Kitwe North", 
    color: "#2563eb", // Blue-600
  },
  "Ndola Industrial": {
    label: "Ndola Industrial",
    color: "#3b82f6", // Blue-500
  },
  "Livingstone Resort": {
    label: "Livingstone Resort",
    color: "#60a5fa", // Blue-400
  },
  "Chipata East": {
    label: "Chipata East",
    color: "#93c5fd", // Blue-300
  },
  "Solwezi Mining": {
    label: "Solwezi Mining",
    color: "#dbeafe", // Blue-100
  },
} satisfies ChartConfig

const timePeriods = [
  { key: "7d", label: "Last 7 Days" },
  { key: "30d", label: "Last 30 Days" },
  { key: "3m", label: "Last 3 Months" },
] as const

export function ChartLineActiveCustomers() {
  const [selectedPeriod, setSelectedPeriod] = useState<keyof typeof dataByPeriod>("30d")
  const data = dataByPeriod[selectedPeriod]

  return (
    <div className="space-y-4">
      {/* Time Period Selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">% Active Customers by Grid</h3>
        <Select value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as keyof typeof dataByPeriod)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Select time period" />
          </SelectTrigger>
          <SelectContent>
            {timePeriods.map((period) => (
              <SelectItem key={period.key} value={period.key}>
                {period.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Chart */}
      <ChartContainer config={chartConfig} className="h-[300px] w-full">
        <LineChart
          accessibilityLayer
          data={data}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => `${value}%`}
            domain={[80, 100]}
          />
          <ChartTooltip
            cursor={false}
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          {label}
                        </span>
                        <div className="space-y-1">
                          {payload.map((entry, index) => {
                            // Get the color from the chart config
                            const color = chartConfig[entry.dataKey as keyof typeof chartConfig]?.color || entry.color || '#000000'
                            return (
                              <div key={index} className="flex items-center gap-2">
                                <div 
                                  className="h-2 w-2 rounded-full" 
                                  style={{ backgroundColor: color }}
                                />
                                <span className="text-xs text-muted-foreground">
                                  {entry.name}: {Math.round(entry.value as number)}%
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <defs>
            <linearGradient id="gradientLusaka" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#1e40af" stopOpacity={1} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.8} />
            </linearGradient>
            <linearGradient id="gradientKitwe" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#2563eb" stopOpacity={1} />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.8} />
            </linearGradient>
            <linearGradient id="gradientNdola" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
              <stop offset="100%" stopColor="#93c5fd" stopOpacity={0.8} />
            </linearGradient>
            <linearGradient id="gradientLivingstone" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity={1} />
              <stop offset="100%" stopColor="#dbeafe" stopOpacity={0.8} />
            </linearGradient>
            <linearGradient id="gradientChipata" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#93c5fd" stopOpacity={1} />
              <stop offset="100%" stopColor="#dbeafe" stopOpacity={0.6} />
            </linearGradient>
            <linearGradient id="gradientSolwezi" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#dbeafe" stopOpacity={1} />
              <stop offset="100%" stopColor="#f0f9ff" stopOpacity={0.8} />
            </linearGradient>
          </defs>
          <Line
            dataKey="Lusaka Central"
            type="monotone"
            stroke="url(#gradientLusaka)"
            strokeWidth={1}
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Line
            dataKey="Kitwe North"
            type="monotone"
            stroke="url(#gradientKitwe)"
            strokeWidth={1}
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Line
            dataKey="Ndola Industrial"
            type="monotone"
            stroke="url(#gradientNdola)"
            strokeWidth={1}
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Line
            dataKey="Livingstone Resort"
            type="monotone"
            stroke="url(#gradientLivingstone)"
            strokeWidth={1}
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Line
            dataKey="Chipata East"
            type="monotone"
            stroke="url(#gradientChipata)"
            strokeWidth={1}
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Line
            dataKey="Solwezi Mining"
            type="monotone"
            stroke="url(#gradientSolwezi)"
            strokeWidth={1}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  )
}
