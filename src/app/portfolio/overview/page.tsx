
"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Eye, 
  BarChart3,
  PieChartIcon,
  Activity,
  DollarSign,
  Target,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";

interface PortfolioHolding {
  symbol: string;
  name: string;
  amount: number;
  value: number;
  price: number;
  change24h: number;
  allocation: number;
}

interface PortfolioData {
  totalValue: number;
  totalPnL: number;
  totalPnLPercentage: number;
  dayChange: number;
  dayChangePercentage: number;
  holdings: PortfolioHolding[];
}

export default function PortfolioOverviewPage() {
  const [timeframe, setTimeframe] = useState('7d');
  const [loading, setLoading] = useState(false);

  // Mock portfolio data
  const portfolioData: PortfolioData = {
    totalValue: 45420.67,
    totalPnL: 8920.34,
    totalPnLPercentage: 24.45,
    dayChange: 1230.45,
    dayChangePercentage: 2.78,
    holdings: [
      {
        symbol: 'BTC',
        name: 'Bitcoin',
        amount: 0.75,
        value: 20450.23,
        price: 67234.31,
        change24h: 2.45,
        allocation: 45.0
      },
      {
        symbol: 'ETH',
        name: 'Ethereum',
        amount: 5.2,
        value: 14820.67,
        price: 2850.13,
        change24h: 1.89,
        allocation: 32.6
      },
      {
        symbol: 'SOL',
        name: 'Solana',
        amount: 28.5,
        value: 5340.12,
        price: 187.37,
        change24h: 4.12,
        allocation: 11.8
      },
      {
        symbol: 'AVAX',
        name: 'Avalanche',
        amount: 65.3,
        value: 2785.45,
        price: 42.67,
        change24h: -1.23,
        allocation: 6.1
      },
      {
        symbol: 'LINK',
        name: 'Chainlink',
        amount: 142.8,
        value: 2024.20,
        price: 16.89,
        change24h: 3.45,
        allocation: 4.5
      }
    ]
  };

  // Mock historical data
  const historicalData = [
    { date: '2024-01-01', value: 32000 },
    { date: '2024-01-15', value: 35000 },
    { date: '2024-02-01', value: 33000 },
    { date: '2024-02-15', value: 38000 },
    { date: '2024-03-01', value: 42000 },
    { date: '2024-03-15', value: 45420 },
  ];

  const allocationData = portfolioData.holdings.map(holding => ({
    name: holding.symbol,
    value: holding.allocation,
    actualValue: holding.value,
    color: getTokenColor(holding.symbol)
  }));

  function getTokenColor(symbol: string): string {
    const colors: { [key: string]: string } = {
      'BTC': '#F7931A',
      'ETH': '#627EEA',
      'SOL': '#9945FF',
      'AVAX': '#E84142',
      'LINK': '#375BD2'
    };
    return colors[symbol] || '#8884d8';
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: value > 1000000 ? 'compact' : 'standard',
      maximumFractionDigits: 2,
    }).format(value);
  };

  const getRiskLevel = (allocation: number): { level: string, color: string } => {
    if (allocation > 50) return { level: 'High Risk', color: 'text-red-600' };
    if (allocation > 30) return { level: 'Medium Risk', color: 'text-yellow-600' };
    return { level: 'Low Risk', color: 'text-green-600' };
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Portfolio Overview</h1>
            <p className="text-muted-foreground">
              Track your cryptocurrency investments and performance
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/portfolio/add-transaction">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Transaction
              </Button>
            </Link>
            <Link href="/advanced-portfolio">
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Advanced Analysis
              </Button>
            </Link>
          </div>
        </div>

        {/* Portfolio Summary */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                  <p className="text-2xl font-bold">{formatCurrency(portfolioData.totalValue)}</p>
                </div>
                <Wallet className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="mt-2 flex items-center gap-2">
                {portfolioData.dayChangePercentage >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span className={`text-sm font-medium ${portfolioData.dayChangePercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {portfolioData.dayChangePercentage >= 0 ? '+' : ''}{portfolioData.dayChangePercentage.toFixed(2)}% (24h)
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total P&L</p>
                  <p className="text-2xl font-bold">{formatCurrency(portfolioData.totalPnL)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="mt-2">
                <Badge variant={portfolioData.totalPnLPercentage >= 0 ? 'default' : 'destructive'}>
                  {portfolioData.totalPnLPercentage >= 0 ? '+' : ''}{portfolioData.totalPnLPercentage.toFixed(2)}%
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Day Change</p>
                  <p className="text-2xl font-bold">{formatCurrency(portfolioData.dayChange)}</p>
                </div>
                <Activity className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Last 24 hours</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Holdings</p>
                  <p className="text-2xl font-bold">{portfolioData.holdings.length}</p>
                </div>
                <Target className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Different assets</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="holdings">Holdings</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Portfolio Value</CardTitle>
                    <CardDescription>Historical portfolio value over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={historicalData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis tickFormatter={(value) => formatCurrency(value)} />
                        <Tooltip formatter={(value: number) => [formatCurrency(value), 'Portfolio Value']} />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#8884d8" 
                          fill="url(#colorGradient)" 
                          strokeWidth={2}
                        />
                        <defs>
                          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
                          </linearGradient>
                        </defs>
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Asset Allocation</CardTitle>
                    <CardDescription>Portfolio distribution by value</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={allocationData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({name, value}) => `${name} ${value.toFixed(1)}%`}
                        >
                          {allocationData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => [`${value.toFixed(1)}%`, 'Allocation']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="holdings">
            <Card>
              <CardHeader>
                <CardTitle>Current Holdings</CardTitle>
                <CardDescription>Detailed breakdown of your cryptocurrency positions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {portfolioData.holdings.map((holding) => (
                    <div key={holding.symbol} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: getTokenColor(holding.symbol) }}
                        >
                          {holding.symbol.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{holding.symbol}</span>
                            <Badge variant="outline" className="text-xs">
                              {holding.allocation.toFixed(1)}%
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{holding.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{formatCurrency(holding.value)}</div>
                        <div className="text-sm text-muted-foreground">
                          {holding.amount.toLocaleString()} @ {formatCurrency(holding.price)}
                        </div>
                        <div className={`text-xs flex items-center justify-end gap-1 ${holding.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {holding.change24h >= 0 ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          {holding.change24h >= 0 ? '+' : ''}{holding.change24h.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>Key portfolio performance indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>7d Return</span>
                      <span className="font-semibold text-green-600">+5.7%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>30d Return</span>
                      <span className="font-semibold text-green-600">+12.3%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>90d Return</span>
                      <span className="font-semibold text-green-600">+24.8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>All Time High</span>
                      <span className="font-semibold">{formatCurrency(52000)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Max Drawdown</span>
                      <span className="font-semibold text-red-600">-18.2%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Asset Performance</CardTitle>
                  <CardDescription>24h change by holding</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={portfolioData.holdings}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="symbol" />
                      <YAxis tickFormatter={(value) => `${value}%`} />
                      <Tooltip formatter={(value: number) => [`${value.toFixed(2)}%`, 'Change']} />
                      <Bar dataKey="change24h" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analysis">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Risk Analysis</CardTitle>
                  <CardDescription>Portfolio risk assessment</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {portfolioData.holdings.map((holding) => {
                      const risk = getRiskLevel(holding.allocation);
                      return (
                        <div key={holding.symbol} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{holding.symbol}</span>
                            <Badge variant="outline">{holding.allocation.toFixed(1)}%</Badge>
                          </div>
                          <span className={`text-sm font-medium ${risk.color}`}>
                            {risk.level}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Diversification Score</CardTitle>
                  <CardDescription>Portfolio diversification analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Overall Score</span>
                        <span className="text-sm font-medium">Good</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-blue-500 mt-0.5" />
                        <div className="text-xs text-blue-700 dark:text-blue-300">
                          <p className="font-medium">Recommendation:</p>
                          <p>Consider diversifying into different sectors to reduce risk concentration.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
