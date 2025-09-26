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
import { useCurrency } from "@/hooks/use-currency"
import { getCurrencySymbolOnly } from "@smm/shared/src/currency-utils"
import { Currency } from "@/components/currency"

// Sample data for different time periods - Grid revenue data
const dataByPeriod = {
  "7d": [
    { date: "Mon", revenue: 187 },
    { date: "Tue", revenue: 234 },
    { date: "Wed", revenue: 198 },
    { date: "Thu", revenue: 267 },
    { date: "Fri", revenue: 312 },
    { date: "Sat", revenue: 145 },
    { date: "Sun", revenue: 123 },
  ],
  "1m": [
    { week: "Week 1", revenue: 1890 },
    { week: "Week 2", revenue: 2340 },
    { week: "Week 3", revenue: 1980 },
    { week: "Week 4", revenue: 2670 },
  ],
  "3m": [
    { month: "Nov", revenue: 8230 },
    { month: "Dec", revenue: 9450 },
    { month: "Jan", revenue: 8920 },
  ],
  "6m": [
    { month: "Aug", revenue: 7890 },
    { month: "Sep", revenue: 8450 },
    { month: "Oct", revenue: 8120 },
    { month: "Nov", revenue: 8230 },
    { month: "Dec", revenue: 9450 },
    { month: "Jan", revenue: 8920 },
  ],
}

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "#3b82f6",
  },
} satisfies ChartConfig

const timePeriods = [
  { key: "7d", label: "Last 7 days" },
  { key: "1m", label: "Last month" },
  { key: "3m", label: "Last 3 months" },
  { key: "6m", label: "Last 6 months" },
] as const

export function ChartMinigridRevenue() {
  const [selectedPeriod, setSelectedPeriod] = useState<keyof typeof dataByPeriod>("1m")
  const data = dataByPeriod[selectedPeriod]
  const { currency: branchCurrency } = useCurrency()
  const currencySymbol = getCurrencySymbolOnly(branchCurrency)

  return (
    <div className="space-y-4">
      {/* Time Period Selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Grid Revenue</h3>
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
            dataKey={selectedPeriod === "3m" || selectedPeriod === "6m" ? "month" : selectedPeriod === "1m" ? "week" : "date"}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => `${currencySymbol}${value.toLocaleString()}`}
            domain={[0, 'dataMax + 0.1']}
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
                                {entry.name}: <Currency amount={entry.value as number} decimals={0} />
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
            <linearGradient id="gradientRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <Area
            dataKey="revenue"
            type="monotone"
            fill="url(#gradientRevenue)"
            fillOpacity={0.6}
            stroke="#3b82f6"
            strokeWidth={1}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}
