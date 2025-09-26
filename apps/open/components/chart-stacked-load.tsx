"use client"

import { useState } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
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

// Sample data for different time periods - Load distribution (sorted with largest at bottom)
const dataByPeriod = {
  "24h": [
    { time: "00:00", "Others": 12, "Top User 10": 1, "Top User 9": 2, "Top User 8": 3, "Top User 7": 4, "Top User 6": 5, "Top User 5": 6, "Top User 4": 7, "Top User 3": 8, "Top User 2": 9, "Top User 1": 10 },
    { time: "02:00", "Others": 8, "Top User 10": 1, "Top User 9": 1, "Top User 8": 2, "Top User 7": 2, "Top User 6": 3, "Top User 5": 3, "Top User 4": 4, "Top User 3": 5, "Top User 2": 6, "Top User 1": 7 },
    { time: "04:00", "Others": 6, "Top User 10": 1, "Top User 9": 1, "Top User 8": 1, "Top User 7": 2, "Top User 6": 2, "Top User 5": 2, "Top User 4": 3, "Top User 3": 3, "Top User 2": 4, "Top User 1": 5 },
    { time: "06:00", "Others": 15, "Top User 10": 2, "Top User 9": 3, "Top User 8": 4, "Top User 7": 5, "Top User 6": 6, "Top User 5": 7, "Top User 4": 8, "Top User 3": 9, "Top User 2": 10, "Top User 1": 12 },
    { time: "08:00", "Others": 25, "Top User 10": 3, "Top User 9": 4, "Top User 8": 5, "Top User 7": 6, "Top User 6": 7, "Top User 5": 8, "Top User 4": 9, "Top User 3": 10, "Top User 2": 12, "Top User 1": 15 },
    { time: "10:00", "Others": 35, "Top User 10": 4, "Top User 9": 5, "Top User 8": 6, "Top User 7": 7, "Top User 6": 8, "Top User 5": 9, "Top User 4": 10, "Top User 3": 12, "Top User 2": 15, "Top User 1": 18 },
    { time: "12:00", "Others": 45, "Top User 10": 5, "Top User 9": 6, "Top User 8": 7, "Top User 7": 8, "Top User 6": 9, "Top User 5": 10, "Top User 4": 12, "Top User 3": 15, "Top User 2": 18, "Top User 1": 22 },
    { time: "14:00", "Others": 50, "Top User 10": 6, "Top User 9": 7, "Top User 8": 8, "Top User 7": 9, "Top User 6": 10, "Top User 5": 12, "Top User 4": 15, "Top User 3": 18, "Top User 2": 22, "Top User 1": 25 },
    { time: "16:00", "Others": 40, "Top User 10": 5, "Top User 9": 6, "Top User 8": 7, "Top User 7": 8, "Top User 6": 9, "Top User 5": 10, "Top User 4": 12, "Top User 3": 15, "Top User 2": 18, "Top User 1": 20 },
    { time: "18:00", "Others": 30, "Top User 10": 4, "Top User 9": 5, "Top User 8": 6, "Top User 7": 7, "Top User 6": 8, "Top User 5": 9, "Top User 4": 10, "Top User 3": 12, "Top User 2": 15, "Top User 1": 18 },
    { time: "20:00", "Others": 20, "Top User 10": 3, "Top User 9": 4, "Top User 8": 5, "Top User 7": 6, "Top User 6": 7, "Top User 5": 8, "Top User 4": 9, "Top User 3": 10, "Top User 2": 12, "Top User 1": 15 },
    { time: "22:00", "Others": 15, "Top User 10": 2, "Top User 9": 3, "Top User 8": 4, "Top User 7": 5, "Top User 6": 6, "Top User 5": 7, "Top User 4": 8, "Top User 3": 9, "Top User 2": 10, "Top User 1": 12 },
  ],
  "7d": [
    { date: "Mon", "Others": 75, "Top User 10": 8, "Top User 9": 12, "Top User 8": 18, "Top User 7": 22, "Top User 6": 28, "Top User 5": 35, "Top User 4": 42, "Top User 3": 48, "Top User 2": 55, "Top User 1": 62 },
    { date: "Tue", "Others": 95, "Top User 10": 15, "Top User 9": 18, "Top User 8": 22, "Top User 7": 28, "Top User 6": 35, "Top User 5": 42, "Top User 4": 48, "Top User 3": 55, "Top User 2": 62, "Top User 1": 68 },
    { date: "Wed", "Others": 45, "Top User 10": 5, "Top User 9": 8, "Top User 8": 12, "Top User 7": 15, "Top User 6": 18, "Top User 5": 22, "Top User 4": 28, "Top User 3": 32, "Top User 2": 38, "Top User 1": 42 },
    { date: "Thu", "Others": 110, "Top User 10": 18, "Top User 9": 22, "Top User 8": 28, "Top User 7": 35, "Top User 6": 42, "Top User 5": 48, "Top User 4": 55, "Top User 3": 62, "Top User 2": 68, "Top User 1": 75 },
    { date: "Fri", "Others": 65, "Top User 10": 10, "Top User 9": 15, "Top User 8": 18, "Top User 7": 22, "Top User 6": 28, "Top User 5": 32, "Top User 4": 38, "Top User 3": 42, "Top User 2": 48, "Top User 1": 52 },
    { date: "Sat", "Others": 85, "Top User 10": 12, "Top User 9": 18, "Top User 8": 22, "Top User 7": 28, "Top User 6": 32, "Top User 5": 38, "Top User 4": 42, "Top User 3": 48, "Top User 2": 52, "Top User 1": 58 },
    { date: "Sun", "Others": 55, "Top User 10": 8, "Top User 9": 12, "Top User 8": 15, "Top User 7": 18, "Top User 6": 22, "Top User 5": 28, "Top User 4": 32, "Top User 3": 35, "Top User 2": 38, "Top User 1": 42 },
  ],
  "1m": [
    { week: "Week 1", "Others": 580, "Top User 1": 285, "Top User 2": 245, "Top User 3": 195, "Top User 4": 165, "Top User 5": 145, "Top User 6": 125, "Top User 7": 105, "Top User 8": 85, "Top User 9": 75, "Top User 10": 65 },
    { week: "Week 2", "Others": 720, "Top User 1": 365, "Top User 2": 315, "Top User 3": 275, "Top User 4": 235, "Top User 5": 205, "Top User 6": 175, "Top User 7": 155, "Top User 8": 135, "Top User 9": 115, "Top User 10": 95 },
    { week: "Week 3", "Others": 520, "Top User 1": 245, "Top User 2": 195, "Top User 3": 165, "Top User 4": 135, "Top User 5": 115, "Top User 6": 95, "Top User 7": 85, "Top User 8": 75, "Top User 9": 65, "Top User 10": 55 },
    { week: "Week 4", "Others": 680, "Top User 1": 345, "Top User 2": 295, "Top User 3": 255, "Top User 4": 215, "Top User 5": 185, "Top User 6": 155, "Top User 7": 135, "Top User 8": 115, "Top User 9": 95, "Top User 10": 85 },
  ],
  "3m": [
    { month: "Apr", "Others": 2200, "Top User 1": 1100, "Top User 2": 950, "Top User 3": 800, "Top User 4": 700, "Top User 5": 600, "Top User 6": 520, "Top User 7": 450, "Top User 8": 380, "Top User 9": 320, "Top User 10": 280 },
    { month: "May", "Others": 2800, "Top User 1": 1400, "Top User 2": 1200, "Top User 3": 1000, "Top User 4": 880, "Top User 5": 760, "Top User 6": 660, "Top User 7": 570, "Top User 8": 480, "Top User 9": 400, "Top User 10": 350 },
    { month: "Jun", "Others": 1950, "Top User 1": 950, "Top User 2": 800, "Top User 3": 680, "Top User 4": 580, "Top User 5": 500, "Top User 6": 420, "Top User 7": 360, "Top User 8": 300, "Top User 9": 250, "Top User 10": 220 },
  ],
}

const chartConfig = {
  "Others": {
    label: "Others",
    color: "#e5e7eb", // Gray-200
  },
  "Top User 10": {
    label: "Top User 10",
    color: "#f59e0b", // Amber-500
  },
  "Top User 9": {
    label: "Top User 9",
    color: "#fcd34d", // Amber-300
  },
  "Top User 8": {
    label: "Top User 8",
    color: "#fde68a", // Amber-200
  },
  "Top User 7": {
    label: "Top User 7",
    color: "#fef3c7", // Amber-100
  },
  "Top User 6": {
    label: "Top User 6",
    color: "#dbeafe", // Blue-100
  },
  "Top User 5": {
    label: "Top User 5",
    color: "#93c5fd", // Blue-300
  },
  "Top User 4": {
    label: "Top User 4",
    color: "#60a5fa", // Blue-400
  },
  "Top User 3": {
    label: "Top User 3",
    color: "#3b82f6", // Blue-500
  },
  "Top User 2": {
    label: "Top User 2",
    color: "#2563eb", // Blue-600
  },
  "Top User 1": {
    label: "Top User 1",
    color: "#1e40af", // Blue-800
  },
} satisfies ChartConfig

const timePeriods = [
  { key: "24h", label: "Last 24 Hours" },
  { key: "7d", label: "Last 7 Days" },
  { key: "1m", label: "Last Month" },
  { key: "3m", label: "Last 3 Months" },
] as const

export function ChartStackedLoad() {
  const [selectedPeriod, setSelectedPeriod] = useState<keyof typeof dataByPeriod>("7d")
  const data = dataByPeriod[selectedPeriod]

  return (
    <div className="space-y-4">
      {/* Time Period Selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Aggregate Load Profile</h3>
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
      <ChartContainer config={chartConfig} className="h-[200px] w-full">
        <AreaChart
          accessibilityLayer
          data={data}
          margin={{
            top: 2,
            bottom: 2,
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey={selectedPeriod === "24h" ? "time" : selectedPeriod === "7d" ? "date" : selectedPeriod === "1m" ? "week" : "month"}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => `${value}kW`}
          />
          <ChartTooltip
            cursor={false}
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                // Define the order to match the chart stacking (top to bottom for tooltip)
                const stackOrder = [
                  "Top User 1",
                  "Top User 2",
                  "Top User 3",
                  "Top User 4",
                  "Top User 5",
                  "Top User 6",
                  "Top User 7",
                  "Top User 8",
                  "Top User 9",
                  "Top User 10",
                  "Others"
                ]
                
                // Filter and sort payload to match stack order
                const sortedPayload = stackOrder
                  .map(key => payload.find(p => p.dataKey === key))
                  .filter(Boolean)
                
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          {label}
                        </span>
                        <div className="space-y-1">
                          {sortedPayload.map((entry, index) => (
                            entry && (
                              <div key={index} className="flex items-center gap-2">
                                <div 
                                  className="h-2 w-2 rounded-full" 
                                  style={{ backgroundColor: entry.color }}
                                />
                                <span className="text-xs text-muted-foreground">
                                  {entry.name}: {entry.value}kW
                                </span>
                              </div>
                            )
                          ))}
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
            <linearGradient id="fillTop1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1e40af" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#1e40af" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="fillTop2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="fillTop3" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="fillTop4" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="fillTop5" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#93c5fd" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#93c5fd" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="fillTop6" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#dbeafe" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#dbeafe" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="fillTop7" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#fef3c7" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#fef3c7" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="fillTop8" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#fde68a" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#fde68a" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="fillTop9" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#fcd34d" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#fcd34d" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="fillTop10" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="fillOthers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#e5e7eb" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#e5e7eb" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <Area
            dataKey="Others"
            type="natural"
            fill="url(#fillOthers)"
            fillOpacity={0.6}
            stroke="#e5e7eb"
            strokeWidth={1}
            stackId="a"
          />
          <Area
            dataKey="Top User 10"
            type="natural"
            fill="url(#fillTop10)"
            fillOpacity={0.6}
            stroke="#f59e0b"
            strokeWidth={1}
            stackId="a"
          />
          <Area
            dataKey="Top User 9"
            type="natural"
            fill="url(#fillTop9)"
            fillOpacity={0.6}
            stroke="#fcd34d"
            strokeWidth={1}
            stackId="a"
          />
          <Area
            dataKey="Top User 8"
            type="natural"
            fill="url(#fillTop8)"
            fillOpacity={0.6}
            stroke="#fde68a"
            strokeWidth={1}
            stackId="a"
          />
          <Area
            dataKey="Top User 7"
            type="natural"
            fill="url(#fillTop7)"
            fillOpacity={0.6}
            stroke="#fef3c7"
            strokeWidth={1}
            stackId="a"
          />
          <Area
            dataKey="Top User 6"
            type="natural"
            fill="url(#fillTop6)"
            fillOpacity={0.6}
            stroke="#dbeafe"
            strokeWidth={1}
            stackId="a"
          />
          <Area
            dataKey="Top User 5"
            type="natural"
            fill="url(#fillTop5)"
            fillOpacity={0.6}
            stroke="#93c5fd"
            strokeWidth={1}
            stackId="a"
          />
          <Area
            dataKey="Top User 4"
            type="natural"
            fill="url(#fillTop4)"
            fillOpacity={0.6}
            stroke="#60a5fa"
            strokeWidth={1}
            stackId="a"
          />
          <Area
            dataKey="Top User 3"
            type="natural"
            fill="url(#fillTop3)"
            fillOpacity={0.6}
            stroke="#3b82f6"
            strokeWidth={1}
            stackId="a"
          />
          <Area
            dataKey="Top User 2"
            type="natural"
            fill="url(#fillTop2)"
            fillOpacity={0.6}
            stroke="#2563eb"
            strokeWidth={1}
            stackId="a"
          />
          <Area
            dataKey="Top User 1"
            type="natural"
            fill="url(#fillTop1)"
            fillOpacity={0.6}
            stroke="#1e40af"
            strokeWidth={1}
            stackId="a"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}
