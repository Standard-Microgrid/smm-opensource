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

// Sample data for different time periods - Customer usage data
const dataByPeriod = {
  "24h": [
    { time: "00:00", usage: 0.2 },
    { time: "02:00", usage: 0.1 },
    { time: "04:00", usage: 0.3 },
    { time: "06:00", usage: 0.8 },
    { time: "08:00", usage: 1.2 },
    { time: "10:00", usage: 1.8 },
    { time: "12:00", usage: 2.1 },
    { time: "14:00", usage: 2.3 },
    { time: "16:00", usage: 1.9 },
    { time: "18:00", usage: 1.5 },
    { time: "20:00", usage: 1.1 },
    { time: "22:00", usage: 0.6 },
  ],
  "7d": [
    { date: "Mon", usage: 2.8 },
    { date: "Tue", usage: 3.2 },
    { date: "Wed", usage: 2.1 },
    { date: "Thu", usage: 3.5 },
    { date: "Fri", usage: 2.9 },
    { date: "Sat", usage: 3.1 },
    { date: "Sun", usage: 2.6 },
  ],
  "1m": [
    { week: "Week 1", usage: 19.6 },
    { week: "Week 2", usage: 22.4 },
    { week: "Week 3", usage: 18.9 },
    { week: "Week 4", usage: 21.7 },
  ],
  "3m": [
    { month: "Nov", usage: 78.4 },
    { month: "Dec", usage: 82.1 },
    { month: "Jan", usage: 85.2 },
  ],
}

const chartConfig = {
  usage: {
    label: "Energy Usage",
    color: "#3b82f6",
  },
} satisfies ChartConfig

const timePeriods = [
  { key: "24h", label: "Last 24 hours" },
  { key: "7d", label: "Last 7 days" },
  { key: "1m", label: "Last month" },
  { key: "3m", label: "Last 3 months" },
] as const

export function ChartCustomerUsage() {
  const [selectedPeriod, setSelectedPeriod] = useState<keyof typeof dataByPeriod>("7d")
  const data = dataByPeriod[selectedPeriod]

  return (
    <div className="space-y-4">
      {/* Time Period Selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Consumption Profile</h3>
        <Select value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as keyof typeof dataByPeriod)}>
          <SelectTrigger className="w-[180px]">
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
            dataKey={selectedPeriod === "24h" ? "time" : selectedPeriod === "3m" ? "month" : selectedPeriod === "1m" ? "week" : "date"}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => `${value}kWh`}
            domain={[0, 'dataMax + 0.5']}
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
                          {payload.map((entry, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <div 
                                className="h-2 w-2 rounded-full" 
                                style={{ backgroundColor: entry.color }}
                              />
                              <span className="text-xs text-muted-foreground">
                                {entry.name}: {entry.value}kWh
                              </span>
                            </div>
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
            <linearGradient id="gradientUsage" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <Area
            dataKey="usage"
            type="monotone"
            fill="url(#gradientUsage)"
            fillOpacity={0.6}
            stroke="#3b82f6"
            strokeWidth={1}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}
