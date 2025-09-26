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

// Sample data for different time periods - Power system metrics
const dataByPeriod = {
  "1d": [
    { time: "00:00", solar: 0, batterySOC: 45, acInverter: 0 },
    { time: "02:00", solar: 0, batterySOC: 42, acInverter: 0 },
    { time: "04:00", solar: 0, batterySOC: 38, acInverter: 0 },
    { time: "06:00", solar: 0, batterySOC: 35, acInverter: 0 },
    { time: "08:00", solar: 1.8, batterySOC: 32, acInverter: 1.5 },
    { time: "10:00", solar: 6.5, batterySOC: 28, acInverter: 6.2 },
    { time: "12:00", solar: 11.2, batterySOC: 25, acInverter: 10.8 },
    { time: "14:00", solar: 13.8, batterySOC: 22, acInverter: 12.5 },
    { time: "16:00", solar: 9.2, batterySOC: 18, acInverter: 8.8 },
    { time: "18:00", solar: 2.1, batterySOC: 15, acInverter: 1.9 },
    { time: "20:00", solar: 0, batterySOC: 12, acInverter: 0 },
    { time: "22:00", solar: 0, batterySOC: 8, acInverter: 0 },
  ],
  "7d": [
    { date: "Mon", solar: 72.5, batterySOC: 35, acInverter: 68.2 },
    { date: "Tue", solar: 88.3, batterySOC: 42, acInverter: 82.1 },
    { date: "Wed", solar: 45.2, batterySOC: 18, acInverter: 38.7 },
    { date: "Thu", solar: 95.8, batterySOC: 55, acInverter: 91.4 },
    { date: "Fri", solar: 67.1, batterySOC: 28, acInverter: 62.3 },
    { date: "Sat", solar: 82.6, batterySOC: 45, acInverter: 78.9 },
    { date: "Sun", solar: 58.4, batterySOC: 22, acInverter: 52.1 },
  ],
}

const chartConfig = {
  solar: {
    label: "Solar Generation",
    color: "#f59e0b", // Amber-500
  },
  batterySOC: {
    label: "Battery SOC",
    color: "#10b981", // Emerald-500
  },
  acInverter: {
    label: "AC Inverter Output",
    color: "#3b82f6", // Blue-500
  },
} satisfies ChartConfig

const timePeriods = [
  { key: "1d", label: "Last 24 Hours" },
  { key: "7d", label: "Last 7 Days" },
] as const

export function ChartPowerSystem() {
  const [selectedPeriod, setSelectedPeriod] = useState<keyof typeof dataByPeriod>("7d")
  const data = dataByPeriod[selectedPeriod]

  return (
    <div className="space-y-4">
      {/* Time Period Selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Power System</h3>
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
        <LineChart
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
            dataKey={selectedPeriod === "1d" ? "time" : "date"}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value}
          />
          <YAxis
            yAxisId="left"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => `${value}kW`}
            domain={[0, 16]}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => `${value}%`}
            domain={[0, 100]}
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
                            let unit = ""
                            if (entry.dataKey === "solar" || entry.dataKey === "acInverter") {
                              unit = "kW"
                            } else if (entry.dataKey === "batterySOC") {
                              unit = "%"
                            }
                            
                            return (
                              <div key={index} className="flex items-center gap-2">
                                <div 
                                  className="h-2 w-2 rounded-full" 
                                  style={{ backgroundColor: entry.color }}
                                />
                                <span className="text-xs text-muted-foreground">
                                  {entry.name}: {entry.value}{unit}
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
          <Line
            yAxisId="left"
            dataKey="solar"
            type="monotone"
            stroke="#f59e0b"
            strokeWidth={1}
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Line
            yAxisId="right"
            dataKey="batterySOC"
            type="monotone"
            stroke="#10b981"
            strokeWidth={1}
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Line
            yAxisId="left"
            dataKey="acInverter"
            type="monotone"
            stroke="#3b82f6"
            strokeWidth={1}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ChartContainer>
      
      {/* Color Key */}
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-300"></div>
          <span className="text-sm text-muted-foreground">Solar Generation</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-300"></div>
          <span className="text-sm text-muted-foreground">Battery SOC</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-300"></div>
          <span className="text-sm text-muted-foreground">AC Inverter Output</span>
        </div>
      </div>
    </div>
  )
}
