"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Eye, 
  Copy, 
  ExternalLink, 
  PlusCircle,
  MinusCircle,
  Activity,
  Layers,
  BarChart3
} from "lucide-react";

interface PortfolioHolding {
  symbol: string;
  name: string;
  balance: number;
  value: number;
  price: number;
  change24h: number;
  blockchain: string;
  address?: string;
}

interface WalletData {
  address: string;
  ensName?: string;
  totalValue: number;
  change24h: number;
  holdings: PortfolioHolding[];
  nftCount: number;
  transactionCount: number;
}

interface ChainDistribution {
  chain: string;
  value: number;
  percentage: number;
  color: string;
}

const BLOCKCHAIN_COLORS: Record<string, string> = {
  ethereum: '#627EEA',
  polygon: '#8247E5',
  bsc: '#F3BA2F',
  arbitrum: '#28A0F0',
  avalanche: '#E84142',
  fantom: '#1969FF',
};

export default function AdvancedPortfolioPage() {
  const [walletAddress, setWalletAddress] = useState('');
  const [portfolioData, setPortfolioData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState('7d');

  // Mock portfolio data
  const mockPortfolioData: WalletData = {
    address: '0x0255c9D3850cacA1152AEB20425C264787661692',
    ensName: 'vitalik.eth',
    totalValue: 1250000,
    change24h: 5.67,
    nftCount: 142,
    transactionCount: 1284,
    holdings: [
      {
        symbol: 'ETH',
        name: 'Ethereum',
        balance: 250.75,
        value: 714125,
        price: 2847.5,
        change24h: 2.3,
        blockchain: 'ethereum'
      },
      {
        symbol: 'WBTC',
        name: 'Wrapped Bitcoin',
        balance: 5.24,
        value: 287400,
        price: 54847.32,
        change24h: -1.2,
        blockchain: 'ethereum'
      },
      {
        symbol: 'USDC',
        name: 'USD Coin',
        balance: 125000,
        value: 125000,
        price: 1.0,
        change24h: 0.01,
        blockchain: 'ethereum'
      },
      {
        symbol: 'AAVE',
        name: 'Aave',
        balance: 430.2,
        value: 68832,
        price: 160.0,
        change24h: 4.2,
        blockchain: 'ethereum'
      },
      {
        symbol: 'UNI',
        name: 'Uniswap',
        balance: 2150.5,
        value: 34408,
        price: 16.0,
        change24h: -2.1,
        blockchain: 'ethereum'
      },
      {
        symbol: 'MATIC',
        name: 'Polygon',
        balance: 15000,
        value: 20235,
        price: 1.349,
        change24h: 3.4,
        blockchain: 'polygon'
      }
    ]
  };

  const handleAnalyzeWallet = async () => {
    if (!walletAddress) return;
    
    setLoading(true);
    setError(null);
    
    // Simulate API call
    setTimeout(() => {
      setPortfolioData(mockPortfolioData);
      setLoading(false);
    }, 2000);
  };

  const chainDistribution: ChainDistribution[] = portfolioData 
    ? Object.entries(
        portfolioData.holdings.reduce((acc, holding) => {
          acc[holding.blockchain] = (acc[holding.blockchain] || 0) + holding.value;
          return acc;
        }, {} as Record<string, number>)
      ).map(([chain, value]) => ({
        chain: chain.charAt(0).toUpperCase() + chain.slice(1),
        value,
        percentage: (value / portfolioData.totalValue) * 100,
        color: BLOCKCHAIN_COLORS[chain] || '#8884d8'
      }))
    : [];

  const tokenDistribution = portfolioData?.holdings.map((holding) => ({
    name: holding.symbol,
    value: holding.value,
    percentage: (holding.value / portfolioData.totalValue) * 100,
    color: BLOCKCHAIN_COLORS[holding.blockchain] || '#8884d8'
  })) || [];

  // Mock historical data
  const historicalData = [
    { date: '2024-01-01', value: 950000 },
    { date: '2024-01-15', value: 1050000 },
    { date: '2024-02-01', value: 980000 },
    { date: '2024-02-15', value: 1120000 },
    { date: '2024-03-01', value: 1180000 },
    { date: '2024-03-15', value: 1250000 },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: value > 1000000 ? 'compact' : 'standard',
      maximumFractionDigits: 2,
    }).format(value);
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Advanced Portfolio</h1>
            <p className="text-muted-foreground">
              Cross-chain portfolio analysis with detailed insights
            </p>
          </div>
        </div>

        {/* Wallet Input */}
        <Card>
          <CardHeader>
            <CardTitle>Analyze Wallet</CardTitle>
            <CardDescription>
              Enter any Ethereum address or ENS name to explore the portfolio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="wallet">Wallet Address or ENS</Label>
                <Input
                  id="wallet"
                  placeholder="0x... or vitalik.eth"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleAnalyzeWallet} disabled={loading || !walletAddress}>
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Analyzing...</span>
                    </div>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Analyze
                    </>
                  )}
                </Button>
              </div>
            </div>
            {error && (
              <p className="text-destructive text-sm mt-2">{error}</p>
            )}
            <div className="mt-3 text-xs text-muted-foreground">
              Demo addresses: vitalik.eth, 0x0255c9D3850cacA1152AEB20425C264787661692
            </div>
          </CardContent>
        </Card>

        {portfolioData && (
          <>
            {/* Portfolio Overview */}
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
                    {portfolioData.change24h >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`text-sm font-medium ${portfolioData.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {portfolioData.change24h >= 0 ? '+' : ''}{portfolioData.change24h.toFixed(2)}% (24h)
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Holdings</p>
                      <p className="text-2xl font-bold">{portfolioData.holdings.length}</p>
                    </div>
                    <Layers className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Active tokens</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">NFTs</p>
                      <p className="text-2xl font-bold">{portfolioData.nftCount}</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Collectibles owned</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Transactions</p>
                      <p className="text-2xl font-bold">{portfolioData.transactionCount.toLocaleString()}</p>
                    </div>
                    <Activity className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Total transactions</p>
                </CardContent>
              </Card>
            </div>

            {/* Wallet Info */}
            <Card>
              <CardHeader>
                <CardTitle>Wallet Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  {portfolioData.ensName && (
                    <Badge variant="secondary" className="font-mono">
                      {portfolioData.ensName}
                    </Badge>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">{shortenAddress(portfolioData.address)}</span>
                    <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(portfolioData.address)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="holdings">Holdings</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Portfolio Distribution</CardTitle>
                      <CardDescription>Token allocation by value</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={tokenDistribution}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            label={({name, percentage}) => `${name} ${percentage.toFixed(1)}%`}
                          >
                            {tokenDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: number) => [formatCurrency(value), 'Value']} />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Chain Distribution</CardTitle>
                      <CardDescription>Assets across different blockchains</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chainDistribution}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="chain" />
                          <YAxis tickFormatter={(value) => formatCurrency(value)} />
                          <Tooltip formatter={(value: number) => [formatCurrency(value), 'Value']} />
                          <Bar dataKey="value" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="holdings">
                <Card>
                  <CardHeader>
                    <CardTitle>Token Holdings</CardTitle>
                    <CardDescription>Detailed breakdown of all token positions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {portfolioData.holdings.map((holding, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold`} style={{ backgroundColor: BLOCKCHAIN_COLORS[holding.blockchain] }}>
                              {holding.symbol.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{holding.symbol}</span>
                                <Badge variant="outline" className="text-xs">
                                  {holding.blockchain.charAt(0).toUpperCase() + holding.blockchain.slice(1)}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{holding.name}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{formatCurrency(holding.value)}</div>
                            <div className="text-sm text-muted-foreground">
                              {holding.balance.toLocaleString()} @ {formatCurrency(holding.price)}
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

              <TabsContent value="analytics">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Risk Analysis</CardTitle>
                      <CardDescription>Portfolio risk metrics and diversification</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span>Diversification Score</span>
                          <Badge variant="default">Good</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Volatility (30d)</span>
                          <span className="font-semibold">12.4%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Max Drawdown</span>
                          <span className="font-semibold text-red-600">-18.2%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Sharpe Ratio</span>
                          <span className="font-semibold">1.34</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Metrics</CardTitle>
                      <CardDescription>Historical performance indicators</CardDescription>
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
                          <span className="font-semibold">{formatCurrency(1450000)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <CardTitle>Portfolio Value History</CardTitle>
                    <CardDescription>Historical portfolio value over time</CardDescription>
                    <div className="flex gap-2">
                      <Select value={timeframe} onValueChange={setTimeframe}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7d">7 Days</SelectItem>
                          <SelectItem value="30d">30 Days</SelectItem>
                          <SelectItem value="90d">90 Days</SelectItem>
                          <SelectItem value="1y">1 Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
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
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
