"use client"

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { PortfolioItem } from "@/lib/types";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";

const mockPortfolioItems: PortfolioItem[] = [
  { id: "1", token: { id: "bitcoin", name: "Bitcoin", symbol: "BTC", price: 60000, change24h: 0, marketCap: 0 }, amount: 0.1, value: 6000 },
  { id: "2", token: { id: "ethereum", name: "Ethereum", symbol: "ETH", price: 3000, change24h: 0, marketCap: 0 }, amount: 1.5, value: 4500 },
  { id: "3", token: { id: "solana", name: "Solana", symbol: "SOL", price: 150, change24h: 0, marketCap: 0 }, amount: 20, value: 3000 },
];

const totalPortfolioValue = mockPortfolioItems.reduce((sum, item) => sum + item.value, 0);

const chartData = mockPortfolioItems.map(item => ({
  name: item.token.symbol,
  value: item.value,
}));

const chartConfig = {
  value: {
    label: "Value",
  },
  BTC: {
    label: "Bitcoin",
    color: "hsl(var(--chart-1))",
  },
  ETH: {
    label: "Ethereum",
    color: "hsl(var(--chart-2))",
  },
  SOL: {
    label: "Solana",
    color: "hsl(var(--chart-3))",
  },
} satisfies Record<string, {label: string, color?: string}>;


export function PortfolioOverview() {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="font-headline text-xl">Portfolio Overview</CardTitle>
        <CardDescription>Current total value and asset allocation.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">Total Value</p>
          <p className="text-4xl font-bold font-headline text-primary">
            ${totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        
        <h3 className="text-lg font-semibold mb-2 font-headline">Asset Allocation</h3>
         <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart accessibilityLayer>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                strokeWidth={5}
              >
                 {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={chartConfig[entry.name as keyof typeof chartConfig]?.color || "hsl(var(--muted))"}
                    />
                  ))}
              </Pie>
               <ChartLegend
                content={<ChartLegendContent nameKey="name" />}
                className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
