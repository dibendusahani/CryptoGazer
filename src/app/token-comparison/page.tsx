"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts';
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  X, 
  ArrowUpDown,
  Calendar,
  BarChart3,
  Activity
} from "lucide-react";

interface TokenData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  change7d: number;
  marketCap: number;
  volume24h: number;
  supply: number;
  maxSupply?: number;
  blockchain: string[];
  categories: string[];
}

interface ComparisonData {
  date: string;
  [key: string]: any;
}

const MOCK_TOKENS: TokenData[] = [
  {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    price: 2847.52,
    change24h: 2.34,
    change7d: -1.23,
    marketCap: 342000000000,
    volume24h: 15000000000,
    supply: 120280000,
    blockchain: ['ethereum'],
    categories: ['smart-contract-platform', 'layer-1']
  },
  {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 67234.87,
    change24h: 1.87,
    change7d: 3.45,
    marketCap: 1320000000000,
    volume24h: 28000000000,
    supply: 19700000,
    maxSupply: 21000000,
    blockchain: ['bitcoin'],
    categories: ['store-of-value', 'layer-1']
  },
  {
    id: 'solana',
    symbol: 'SOL',
    name: 'Solana',
    price: 187.34,
    change24h: 4.23,
    change7d: 12.67,
    marketCap: 87000000000,
    volume24h: 3200000000,
    supply: 464000000,
    blockchain: ['solana'],
    categories: ['smart-contract-platform', 'layer-1']
  },
  {
    id: 'avalanche',
    symbol: 'AVAX',
    name: 'Avalanche',
    price: 42.67,
    change24h: -2.34,
    change7d: 8.92,
    marketCap: 16800000000,
    volume24h: 850000000,
    supply: 394000000,
    maxSupply: 720000000,
    blockchain: ['avalanche'],
    categories: ['smart-contract-platform', 'layer-1']
  },
  {
    id: 'chainlink',
    symbol: 'LINK',
    name: 'Chainlink',
    price: 16.89,
    change24h: 3.45,
    change7d: -4.23,
    marketCap: 10200000000,
    volume24h: 420000000,
    supply: 608000000,
    maxSupply: 1000000000,
    blockchain: ['ethereum'],
    categories: ['oracle', 'defi']
  },
  {
    id: 'aave',
    symbol: 'AAVE',
    name: 'Aave',
    price: 284.92,
    change24h: 5.67,
    change7d: 15.23,
    marketCap: 4300000000,
    volume24h: 180000000,
    supply: 15100000,
    maxSupply: 16000000,
    blockchain: ['ethereum', 'polygon', 'avalanche'],
    categories: ['defi', 'lending']
  }
];

export default function TokenComparisonPage() {
  const [selectedTokens, setSelectedTokens] = useState<TokenData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [timeframe, setTimeframe] = useState('7d');
  const [comparisonType, setComparisonType] = useState('price');
  const [filteredTokens, setFilteredTokens] = useState<TokenData[]>(MOCK_TOKENS);

  useEffect(() => {
    const filtered = MOCK_TOKENS.filter(token =>
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTokens(filtered);
  }, [searchQuery]);

  const addToken = (token: TokenData) => {
    if (selectedTokens.length < 5 && !selectedTokens.find(t => t.id === token.id)) {
      setSelectedTokens([...selectedTokens, token]);
    }
  };

  const removeToken = (tokenId: string) => {
    setSelectedTokens(selectedTokens.filter(t => t.id !== tokenId));
  };

  // Mock historical data generation
  const generateComparisonData = (): ComparisonData[] => {
    const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : timeframe === '90d' ? 90 : 365;
    const data: ComparisonData[] = [];
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i));
      
      const dataPoint: ComparisonData = {
        date: date.toISOString().split('T')[0]
      };
      
      selectedTokens.forEach(token => {
        // Generate mock historical data with some volatility
        const basePrice = token.price;
        const volatility = Math.random() * 0.1 - 0.05; // ±5% daily volatility
        const trendFactor = (token.change7d / 100) * (i / days);
        dataPoint[token.symbol] = basePrice * (1 + trendFactor + volatility);
      });
      
      data.push(dataPoint);
    }
    
    return data;
  };

  const comparisonData = generateComparisonData();

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
      notation: value > 1000000 ? 'compact' : 'standard',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getTokenColors = (index: number) => {
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'];
    return colors[index % colors.length];
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Token Comparison</h1>
            <p className="text-muted-foreground">
              Compare performance across different cryptocurrencies
            </p>
          </div>
          <div className="flex gap-3">
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
            <Select value={comparisonType} onValueChange={setComparisonType}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="marketcap">Market Cap</SelectItem>
                <SelectItem value="volume">Volume</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Token Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Tokens to Compare ({selectedTokens.length}/5)</CardTitle>
            <CardDescription>Choose up to 5 tokens for detailed comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tokens..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Selected Tokens */}
            {selectedTokens.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium mb-2">Selected Tokens:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedTokens.map((token, index) => (
                    <Badge
                      key={token.id}
                      variant="secondary"
                      className="flex items-center gap-2 py-1 px-3"
                      style={{ borderColor: getTokenColors(index), borderWidth: 2 }}
                    >
                      <span className="font-semibold">{token.symbol}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeToken(token.id)}
                        className="h-4 w-4 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Available Tokens */}
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 max-h-60 overflow-y-auto">
              {filteredTokens.map((token) => (
                <div
                  key={token.id}
                  className={`flex items-center justify-between p-3 border rounded cursor-pointer hover:bg-muted/50 transition-colors ${
                    selectedTokens.find(t => t.id === token.id) ? 'bg-muted border-primary' : ''
                  }`}
                  onClick={() => addToken(token)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-bold">{token.symbol.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-semibold">{token.symbol}</p>
                      <p className="text-xs text-muted-foreground">{token.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">{formatCurrency(token.price)}</p>
                    <div className={`text-xs flex items-center gap-1 ${
                      token.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {token.change24h >= 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {selectedTokens.length >= 2 && (
          <Tabs defaultValue="chart" className="space-y-4">
            <TabsList>
              <TabsTrigger value="chart">Price Chart</TabsTrigger>
              <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="fundamentals">Fundamentals</TabsTrigger>
            </TabsList>

            <TabsContent value="chart">
              <Card>
                <CardHeader>
                  <CardTitle>Price Comparison</CardTitle>
                  <CardDescription>
                    Historical price movement over {timeframe}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis tickFormatter={(value) => formatCurrency(value)} />
                      <Tooltip
                        formatter={(value: number, name: string) => [formatCurrency(value), name]}
                        labelFormatter={(date) => `Date: ${date}`}
                      />
                      <Legend />
                      {selectedTokens.map((token, index) => (
                        <Line
                          key={token.id}
                          type="monotone"
                          dataKey={token.symbol}
                          stroke={getTokenColors(index)}
                          strokeWidth={2}
                          dot={false}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="metrics">
              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Key Metrics Comparison</CardTitle>
                    <CardDescription>Side-by-side comparison of important metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">Metric</th>
                            {selectedTokens.map((token, index) => (
                              <th key={token.id} className="text-center py-2" style={{ color: getTokenColors(index) }}>
                                {token.symbol}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="py-3 font-medium">Price</td>
                            {selectedTokens.map((token) => (
                              <td key={token.id} className="py-3 text-center">{formatCurrency(token.price)}</td>
                            ))}
                          </tr>
                          <tr className="border-b">
                            <td className="py-3 font-medium">24h Change</td>
                            {selectedTokens.map((token) => (
                              <td key={token.id} className={`py-3 text-center ${token.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
                              </td>
                            ))}
                          </tr>
                          <tr className="border-b">
                            <td className="py-3 font-medium">7d Change</td>
                            {selectedTokens.map((token) => (
                              <td key={token.id} className={`py-3 text-center ${token.change7d >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {token.change7d >= 0 ? '+' : ''}{token.change7d.toFixed(2)}%
                              </td>
                            ))}
                          </tr>
                          <tr className="border-b">
                            <td className="py-3 font-medium">Market Cap</td>
                            {selectedTokens.map((token) => (
                              <td key={token.id} className="py-3 text-center">{formatCurrency(token.marketCap)}</td>
                            ))}
                          </tr>
                          <tr className="border-b">
                            <td className="py-3 font-medium">24h Volume</td>
                            {selectedTokens.map((token) => (
                              <td key={token.id} className="py-3 text-center">{formatCurrency(token.volume24h)}</td>
                            ))}
                          </tr>
                          <tr>
                            <td className="py-3 font-medium">Circulating Supply</td>
                            {selectedTokens.map((token) => (
                              <td key={token.id} className="py-3 text-center">{formatNumber(token.supply)}</td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="performance">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Comparison</CardTitle>
                    <CardDescription>Relative performance over selected timeframe</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={selectedTokens}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="symbol" />
                        <YAxis tickFormatter={(value) => `${value}%`} />
                        <Tooltip formatter={(value: number) => [`${value.toFixed(2)}%`, 'Change']} />
                        <Bar dataKey="change7d" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Volume Comparison</CardTitle>
                    <CardDescription>24h trading volume comparison</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={selectedTokens}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="symbol" />
                        <YAxis tickFormatter={(value) => formatCurrency(value)} />
                        <Tooltip formatter={(value: number) => [formatCurrency(value), 'Volume']} />
                        <Bar dataKey="volume24h" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="fundamentals">
              <div className="grid gap-4">
                {selectedTokens.map((token, index) => (
                  <Card key={token.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: getTokenColors(index) }}
                        ></div>
                        {token.name} ({token.symbol})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Blockchains</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {token.blockchain.map((chain) => (
                              <Badge key={chain} variant="outline" className="text-xs">
                                {chain}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Categories</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {token.categories.map((category) => (
                              <Badge key={category} variant="secondary" className="text-xs">
                                {category}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Supply</p>
                          <p className="font-semibold">{formatNumber(token.supply)}</p>
                          {token.maxSupply && (
                            <p className="text-xs text-muted-foreground">
                              Max: {formatNumber(token.maxSupply)}
                            </p>
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Market Cap Rank</p>
                          <p className="font-semibold">#{index + 1}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}

        {selectedTokens.length < 2 && (
          <Card>
            <CardContent className="py-12 text-center">
              <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Select Tokens to Compare</h3>
              <p className="text-muted-foreground">
                Choose at least 2 tokens from the list above to start comparing their performance
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
