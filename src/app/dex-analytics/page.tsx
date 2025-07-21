"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, Activity, Zap, ExternalLink, Star, StarOff } from "lucide-react";

interface BlockchainData {
  id: string;
  name: string;
  icon: string;
  color: string;
  gasPrice?: string;
  status: 'active' | 'maintenance';
}

interface DEXPair {
  id: string;
  token0: string;
  token1: string;
  price: number;
  change24h: number;
  volume24h: number;
  liquidity: number;
  dex: string;
  blockchain: string;
}

const SUPPORTED_BLOCKCHAINS: BlockchainData[] = [
  { id: 'ethereum', name: 'Ethereum', icon: '🔷', color: 'bg-blue-500', status: 'active' },
  { id: 'polygon', name: 'Polygon', icon: '🟣', color: 'bg-purple-500', status: 'active' },
  { id: 'bsc', name: 'BNB Chain', icon: '🟡', color: 'bg-yellow-500', status: 'active' },
  { id: 'arbitrum', name: 'Arbitrum', icon: '🔵', color: 'bg-blue-400', status: 'active' },
  { id: 'avalanche', name: 'Avalanche', icon: '🔴', color: 'bg-red-500', status: 'active' },
  { id: 'fantom', name: 'Fantom', icon: '👻', color: 'bg-blue-600', status: 'active' },
];

export default function DEXAnalyticsPage() {
  const [selectedBlockchain, setSelectedBlockchain] = useState('ethereum');
  const [favoritePairs, setFavoritePairs] = useState<string[]>([]);
  const [dexPairs, setDexPairs] = useState<DEXPair[]>([]);
  const [loading, setLoading] = useState(true);
  const [gasData, setGasData] = useState<Record<string, string>>({});

  // Mock data for demonstration
  useEffect(() => {
    const mockPairs: DEXPair[] = [
      {
        id: '1',
        token0: 'WETH',
        token1: 'USDC',
        price: 2845.67,
        change24h: 2.34,
        volume24h: 125000000,
        liquidity: 45000000,
        dex: 'Uniswap V3',
        blockchain: 'ethereum'
      },
      {
        id: '2',
        token0: 'WBTC',
        token1: 'WETH',
        price: 0.0347,
        change24h: -1.23,
        volume24h: 89000000,
        liquidity: 32000000,
        dex: 'SushiSwap',
        blockchain: 'ethereum'
      },
      {
        id: '3',
        token0: 'AAVE',
        token1: 'USDC',
        price: 284.92,
        change24h: 5.67,
        volume24h: 15000000,
        liquidity: 8500000,
        dex: 'Curve',
        blockchain: 'ethereum'
      },
    ];

    setTimeout(() => {
      setDexPairs(mockPairs);
      setLoading(false);
    }, 1000);

    // Mock gas data
    setGasData({
      ethereum: '45 gwei',
      polygon: '150 gwei',
      bsc: '5 gwei',
      arbitrum: '0.5 gwei',
      avalanche: '25 nAVAX',
      fantom: '120 gwei'
    });
  }, []);

  const toggleFavorite = (pairId: string) => {
    setFavoritePairs(prev => 
      prev.includes(pairId) 
        ? prev.filter(id => id !== pairId)
        : [...prev, pairId]
    );
  };

  const formatNumber = (value: number, isPrice: boolean = false) => {
    if (isPrice && value < 1) {
      return `$${value.toFixed(6)}`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: value > 1000000 ? 'compact' : 'standard',
      minimumFractionDigits: isPrice ? 2 : 0,
      maximumFractionDigits: isPrice ? 2 : 2,
    }).format(value);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">DEX Analytics</h1>
            <p className="text-muted-foreground">
              Track prices across multiple blockchains and DEX platforms
            </p>
          </div>
          <div className="flex gap-3">
            <Select value={selectedBlockchain} onValueChange={setSelectedBlockchain}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_BLOCKCHAINS.map((chain) => (
                  <SelectItem key={chain.id} value={chain.id}>
                    <div className="flex items-center gap-2">
                      <span>{chain.icon}</span>
                      <span>{chain.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Blockchain Status Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {SUPPORTED_BLOCKCHAINS.map((chain) => (
            <Card key={chain.id} className={`cursor-pointer transition-all hover:shadow-md ${selectedBlockchain === chain.id ? 'ring-2 ring-primary' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{chain.icon}</span>
                    <div>
                      <p className="font-semibold text-sm">{chain.name}</p>
                      <Badge variant={chain.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                        {chain.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                {gasData[chain.id] && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Zap className="h-3 w-3" />
                    <span>Gas: {gasData[chain.id]}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="pairs" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pairs">Trading Pairs</TabsTrigger>
            <TabsTrigger value="favorites">Favorites ({favoritePairs.length})</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="pairs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Live DEX Pairs</CardTitle>
                <CardDescription>
                  Real-time prices from decentralized exchanges on {SUPPORTED_BLOCKCHAINS.find(c => c.id === selectedBlockchain)?.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 border rounded animate-pulse">
                        <div className="w-8 h-8 bg-gray-300 rounded"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                          <div className="h-3 bg-gray-300 rounded w-1/6"></div>
                        </div>
                        <div className="h-4 bg-gray-300 rounded w-1/6"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {dexPairs.map((pair) => (
                      <div key={pair.id} className="flex items-center justify-between p-4 border rounded hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleFavorite(pair.id)}
                            className="p-1"
                          >
                            {favoritePairs.includes(pair.id) ? (
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ) : (
                              <StarOff className="h-4 w-4" />
                            )}
                          </Button>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">
                                {pair.token0}/{pair.token1}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {pair.dex}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Vol: {formatNumber(pair.volume24h)} • Liq: {formatNumber(pair.liquidity)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">
                              {formatNumber(pair.price, true)}
                            </span>
                            <div className={`flex items-center gap-1 ${pair.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {pair.change24h >= 0 ? (
                                <TrendingUp className="h-4 w-4" />
                              ) : (
                                <TrendingDown className="h-4 w-4" />
                              )}
                              <span className="text-sm font-medium">
                                {pair.change24h >= 0 ? '+' : ''}{pair.change24h.toFixed(2)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites">
            <Card>
              <CardHeader>
                <CardTitle>Favorite Pairs</CardTitle>
                <CardDescription>
                  Keep track of your favorite trading pairs across all chains
                </CardDescription>
              </CardHeader>
              <CardContent>
                {favoritePairs.length === 0 ? (
                  <div className="text-center py-12">
                    <Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No favorite pairs yet</p>
                    <p className="text-sm text-muted-foreground">Click the star icon on any pair to add it to favorites</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {dexPairs
                      .filter(pair => favoritePairs.includes(pair.id))
                      .map((pair) => (
                        <div key={pair.id} className="flex items-center justify-between p-4 border rounded">
                          <div className="flex items-center gap-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleFavorite(pair.id)}
                              className="p-1"
                            >
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            </Button>
                            <div>
                              <span className="font-semibold">
                                {pair.token0}/{pair.token1}
                              </span>
                              <Badge variant="outline" className="ml-2 text-xs">
                                {pair.dex}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-semibold">
                              {formatNumber(pair.price, true)}
                            </span>
                            <div className={`text-sm ${pair.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {pair.change24h >= 0 ? '+' : ''}{pair.change24h.toFixed(2)}%
                            </div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Volume Analysis</CardTitle>
                  <CardDescription>24h volume across different DEXs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['Uniswap V3', 'SushiSwap', 'Curve', 'PancakeSwap'].map((dex, index) => {
                      const volume = Math.random() * 100000000;
                      const percentage = Math.random() * 100;
                      return (
                        <div key={dex} className="flex items-center justify-between">
                          <span className="font-medium">{dex}</span>
                          <div className="text-right">
                            <div className="font-semibold">{formatNumber(volume)}</div>
                            <div className="text-sm text-muted-foreground">
                              {percentage.toFixed(1)}% market share
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Gas Tracker</CardTitle>
                  <CardDescription>Current gas prices across networks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {SUPPORTED_BLOCKCHAINS.map((chain) => (
                      <div key={chain.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span>{chain.icon}</span>
                          <span className="font-medium">{chain.name}</span>
                        </div>
                        <Badge variant="outline">
                          {gasData[chain.id] || 'Loading...'}
                        </Badge>
                      </div>
                    ))}
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
