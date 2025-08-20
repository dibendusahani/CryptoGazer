
"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { TokenTable } from "@/components/dashboard/TokenTable";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Filter, 
  Star, 
  Activity, 
  BarChart3,
  Globe,
  Zap,
  RefreshCw
} from "lucide-react";

interface MarketStats {
  totalMarketCap: number;
  totalVolume24h: number;
  btcDominance: number;
  activeCoins: number;
  marketCapChange24h: number;
}

interface TopGainer {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
}

export default function MarketsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('market_cap');
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(false);

  // Mock market statistics
  const marketStats: MarketStats = {
    totalMarketCap: 2450000000000,
    totalVolume24h: 89000000000,
    btcDominance: 52.8,
    activeCoins: 10847,
    marketCapChange24h: 2.34
  };

  // Mock top gainers/losers
  const topGainers: TopGainer[] = [
    { symbol: 'PEPE', name: 'Pepe', price: 0.00001234, change24h: 34.56, volume24h: 450000000 },
    { symbol: 'ARB', name: 'Arbitrum', price: 1.23, change24h: 28.45, volume24h: 280000000 },
    { symbol: 'OP', name: 'Optimism', price: 2.67, change24h: 22.18, volume24h: 195000000 },
  ];

  const topLosers: TopGainer[] = [
    { symbol: 'LUNA', name: 'Terra Luna', price: 0.87, change24h: -18.32, volume24h: 150000000 },
    { symbol: 'FTT', name: 'FTX Token', price: 2.45, change24h: -12.67, volume24h: 89000000 },
    { symbol: 'LUNC', name: 'Terra Classic', price: 0.0001456, change24h: -9.84, volume24h: 45000000 },
  ];

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: value > 1000000 ? 'compact' : 'standard',
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Markets Overview</h1>
            <p className="text-muted-foreground">
              Explore current cryptocurrency market data and trends
            </p>
          </div>
          <Button onClick={refreshData} disabled={loading}>
            {loading ? (
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Refreshing...</span>
              </div>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Data
              </>
            )}
          </Button>
        </div>

        {/* Market Statistics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Market Cap</p>
                  <p className="text-2xl font-bold">{formatCurrency(marketStats.totalMarketCap)}</p>
                </div>
                <Globe className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="mt-2 flex items-center gap-2">
                {marketStats.marketCapChange24h >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span className={`text-sm font-medium ${marketStats.marketCapChange24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {marketStats.marketCapChange24h >= 0 ? '+' : ''}{marketStats.marketCapChange24h.toFixed(2)}% (24h)
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">24h Volume</p>
                  <p className="text-2xl font-bold">{formatCurrency(marketStats.totalVolume24h)}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Across all exchanges</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">BTC Dominance</p>
                  <p className="text-2xl font-bold">{marketStats.btcDominance.toFixed(1)}%</p>
                </div>
                <Activity className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Bitcoin market share</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Coins</p>
                  <p className="text-2xl font-bold">{formatNumber(marketStats.activeCoins)}</p>
                </div>
                <Zap className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Tracked cryptocurrencies</p>
            </CardContent>
          </Card>
        </div>

        {/* Market Movers */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Top Gainers (24h)
              </CardTitle>
              <CardDescription>Best performing cryptocurrencies today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topGainers.map((token, index) => (
                  <div key={token.symbol} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                        <span className="text-xs font-bold text-green-700 dark:text-green-300">
                          #{index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold">{token.symbol}</p>
                        <p className="text-xs text-muted-foreground">{token.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(token.price)}</p>
                      <div className="flex items-center gap-1 text-green-600">
                        <TrendingUp className="h-3 w-3" />
                        <span className="text-xs font-medium">+{token.change24h.toFixed(2)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-red-600" />
                Top Losers (24h)
              </CardTitle>
              <CardDescription>Worst performing cryptocurrencies today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topLosers.map((token, index) => (
                  <div key={token.symbol} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                        <span className="text-xs font-bold text-red-700 dark:text-red-300">
                          #{index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold">{token.symbol}</p>
                        <p className="text-xs text-muted-foreground">{token.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(token.price)}</p>
                      <div className="flex items-center gap-1 text-red-600">
                        <TrendingDown className="h-3 w-3" />
                        <span className="text-xs font-medium">{token.change24h.toFixed(2)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Market Data Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <CardTitle className="font-headline text-2xl">All Cryptocurrencies</CardTitle>
                <CardDescription>Complete market data for all tracked cryptocurrencies</CardDescription>
              </div>
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search cryptocurrencies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="defi">DeFi</SelectItem>
                    <SelectItem value="layer1">Layer 1</SelectItem>
                    <SelectItem value="meme">Meme Coins</SelectItem>
                    <SelectItem value="gaming">Gaming</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="market_cap">Market Cap</SelectItem>
                    <SelectItem value="volume">Volume</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="change">24h Change</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <TokenTable />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
