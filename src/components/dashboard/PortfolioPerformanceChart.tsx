"use client"

import { TrendingUp } from "lucide-react";
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import type { ChartDataPoint } from "@/lib/types";

const mockChartData: ChartDataPoint[] = [
  { date: "Jan", value: 8000 },
  { date: "Feb", value: 9500 },
  { date: "Mar", value: 11000 },
  { date: "Apr", value: 10500 },
  { date: "May", value: 12000 },
  { date: "Jun", value: 13500 },
];

const chartConfig = {
  portfolioValue: {
    label: "Portfolio Value",
    color: "hsl(var(--primary))",
  },
} satisfies Record<string, { label: string; color: string }>;


export function PortfolioPerformanceChart() {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="font-headline text-xl">Portfolio Performance</CardTitle>
        <CardDescription>Your portfolio value over the last 6 months.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
          <LineChart
            accessibilityLayer
            data={mockChartData}
            margin={{
              left: 12,
              right: 12,
              top: 12,
              bottom: 12,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
             <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <Line
              dataKey="value"
              type="monotone"
              stroke="var(--color-portfolioValue)"
              strokeWidth={3}
              dot={true}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </LineChart>
        </ChartContainer>
      </CardContent>
       <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4 text-green-500" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total portfolio value for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
