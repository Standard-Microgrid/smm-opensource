"use client"

import { useState } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Button } from "@/components/ui/button"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

// Sample data for different time periods
const dataByPeriod = {
  "7d": [
    { date: "Jun 24", "Lusaka Central": 450, "Kitwe North": 320, "Ndola Industrial": 580, "Livingstone Resort": 180, "Chipata East": 280, "Solwezi Mining": 420 },
    { date: "Jun 25", "Lusaka Central": 380, "Kitwe North": 290, "Ndola Industrial": 520, "Livingstone Resort": 160, "Chipata East": 250, "Solwezi Mining": 380 },
    { date: "Jun 26", "Lusaka Central": 520, "Kitwe North": 380, "Ndola Industrial": 680, "Livingstone Resort": 220, "Chipata East": 320, "Solwezi Mining": 480 },
    { date: "Jun 27", "Lusaka Central": 680, "Kitwe North": 520, "Ndola Industrial": 850, "Livingstone Resort": 280, "Chipata East": 420, "Solwezi Mining": 620 },
    { date: "Jun 28", "Lusaka Central": 580, "Kitwe North": 450, "Ndola Industrial": 720, "Livingstone Resort": 240, "Chipata East": 360, "Solwezi Mining": 540 },
    { date: "Jun 29", "Lusaka Central": 420, "Kitwe North": 320, "Ndola Industrial": 580, "Livingstone Resort": 200, "Chipata East": 300, "Solwezi Mining": 450 },
    { date: "Jun 30", "Lusaka Central": 750, "Kitwe North": 580, "Ndola Industrial": 920, "Livingstone Resort": 320, "Chipata East": 480, "Solwezi Mining": 720 },
  ],
  "30d": [
    { date: "Jun 1", "Lusaka Central": 12450, "Kitwe North": 9890, "Ndola Industrial": 15200, "Livingstone Resort": 6200, "Chipata East": 11100, "Solwezi Mining": 13800 },
    { date: "Jun 8", "Lusaka Central": 13200, "Kitwe North": 10500, "Ndola Industrial": 16100, "Livingstone Resort": 6800, "Chipata East": 11800, "Solwezi Mining": 14600 },
    { date: "Jun 15", "Lusaka Central": 12800, "Kitwe North": 10200, "Ndola Industrial": 15800, "Livingstone Resort": 6500, "Chipata East": 11500, "Solwezi Mining": 14200 },
    { date: "Jun 22", "Lusaka Central": 13500, "Kitwe North": 10800, "Ndola Industrial": 16400, "Livingstone Resort": 7000, "Chipata East": 12000, "Solwezi Mining": 14900 },
    { date: "Jun 30", "Lusaka Central": 14200, "Kitwe North": 11200, "Ndola Industrial": 17000, "Livingstone Resort": 7500, "Chipata East": 12500, "Solwezi Mining": 15500 },
  ],
  "3m": [
    { date: "Apr", "Lusaka Central": 37450, "Kitwe North": 29690, "Ndola Industrial": 45600, "Livingstone Resort": 18600, "Chipata East": 33300, "Solwezi Mining": 41400 },
    { date: "May", "Lusaka Central": 38900, "Kitwe North": 30800, "Ndola Industrial": 47200, "Livingstone Resort": 19200, "Chipata East": 34500, "Solwezi Mining": 42800 },
    { date: "Jun", "Lusaka Central": 40100, "Kitwe North": 31800, "Ndola Industrial": 48500, "Livingstone Resort": 19800, "Chipata East": 35500, "Solwezi Mining": 44100 },
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

export function ChartAreaInteractive() {
  const [selectedPeriod, setSelectedPeriod] = useState<keyof typeof dataByPeriod>("30d")
  const data = dataByPeriod[selectedPeriod]

  return (
    <div className="space-y-4">
      {/* Time Period Selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Revenue by Grid</h3>
        <div className="flex gap-2">
          {timePeriods.map((period) => (
            <Button
              key={period.key}
              variant={selectedPeriod === period.key ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod(period.key)}
              className="text-xs"
            >
              {period.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <ChartContainer config={chartConfig} className="h-[300px] w-full">
        <AreaChart
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
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <defs>
            <linearGradient id="fillLusaka" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1e40af" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#1e40af" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="fillKitwe" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="fillNdola" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="fillLivingstone" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="fillChipata" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#93c5fd" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#93c5fd" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="fillSolwezi" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#dbeafe" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#dbeafe" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <Area
            dataKey="Lusaka Central"
            type="natural"
            fill="url(#fillLusaka)"
            fillOpacity={0.4}
            stroke="var(--color-Lusaka Central)"
            stackId="a"
          />
          <Area
            dataKey="Kitwe North"
            type="natural"
            fill="url(#fillKitwe)"
            fillOpacity={0.4}
            stroke="var(--color-Kitwe North)"
            stackId="a"
          />
          <Area
            dataKey="Ndola Industrial"
            type="natural"
            fill="url(#fillNdola)"
            fillOpacity={0.4}
            stroke="var(--color-Ndola Industrial)"
            stackId="a"
          />
          <Area
            dataKey="Livingstone Resort"
            type="natural"
            fill="url(#fillLivingstone)"
            fillOpacity={0.4}
            stroke="var(--color-Livingstone Resort)"
            stackId="a"
          />
          <Area
            dataKey="Chipata East"
            type="natural"
            fill="url(#fillChipata)"
            fillOpacity={0.4}
            stroke="var(--color-Chipata East)"
            stackId="a"
          />
          <Area
            dataKey="Solwezi Mining"
            type="natural"
            fill="url(#fillSolwezi)"
            fillOpacity={0.4}
            stroke="var(--color-Solwezi Mining)"
            stackId="a"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}
