"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts';
import { 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  Info,
  Flame,
  Gauge
} from "lucide-react";

interface GasData {
  network: string;
  name: string;
  icon: string;
  color: string;
  gasPrice: {
    slow: number;
    standard: number;
    fast: number;
    instant: number;
  };
  gasLimit: {
    transfer: number;
    erc20: number;
    uniswapSwap: number;
    nftMint: number;
  };
  baseFee?: number;
  priorityFee?: number;
  blockTime: number;
  congestion: 'low' | 'medium' | 'high';
  change24h: number;
  unit: string;
  usdPrice?: number;
}

interface GasHistoryData {
  timestamp: string;
  [key: string]: any;
}

const MOCK_GAS_DATA: GasData[] = [
  {
    network: 'ethereum',
    name: 'Ethereum',
    icon: '🔷',
    color: '#627EEA',
    gasPrice: {
      slow: 25,
      standard: 35,
      fast: 45,
      instant: 55
    },
    gasLimit: {
      transfer: 21000,
      erc20: 65000,
      uniswapSwap: 150000,
      nftMint: 85000
    },
    baseFee: 23,
    priorityFee: 2,
    blockTime: 12,
    congestion: 'medium',
    change24h: -5.4,
    unit: 'gwei',
    usdPrice: 0.000089
  },
  {
    network: 'polygon',
    name: 'Polygon',
    icon: '🟣',
    color: '#8247E5',
    gasPrice: {
      slow: 30,
      standard: 35,
      fast: 40,
      instant: 50
    },
    gasLimit: {
      transfer: 21000,
      erc20: 65000,
      uniswapSwap: 150000,
      nftMint: 85000
    },
    blockTime: 2,
    congestion: 'low',
    change24h: 12.3,
    unit: 'gwei',
    usdPrice: 0.000001
  },
  {
    network: 'bsc',
    name: 'BNB Chain',
    icon: '🟡',
    color: '#F3BA2F',
    gasPrice: {
      slow: 3,
      standard: 5,
      fast: 7,
      instant: 10
    },
    gasLimit: {
      transfer: 21000,
      erc20: 65000,
      uniswapSwap: 150000,
      nftMint: 85000
    },
    blockTime: 3,
    congestion: 'low',
    change24h: 8.7,
    unit: 'gwei',
    usdPrice: 0.000012
  },
  {
    network: 'arbitrum',
    name: 'Arbitrum',
    icon: '🔵',
    color: '#28A0F0',
    gasPrice: {
      slow: 0.1,
      standard: 0.2,
      fast: 0.3,
      instant: 0.5
    },
    gasLimit: {
      transfer: 21000,
      erc20: 65000,
      uniswapSwap: 150000,
      nftMint: 85000
    },
    blockTime: 1,
    congestion: 'low',
    change24h: -2.1,
    unit: 'gwei',
    usdPrice: 0.0000001
  },
  {
    network: 'optimism',
    name: 'Optimism',
    icon: '🔴',
    color: '#FF0420',
    gasPrice: {
      slow: 0.1,
      standard: 0.2,
      fast: 0.3,
      instant: 0.4
    },
    gasLimit: {
      transfer: 21000,
      erc20: 65000,
      uniswapSwap: 150000,
      nftMint: 85000
    },
    blockTime: 2,
    congestion: 'low',
    change24h: 3.2,
    unit: 'gwei',
    usdPrice: 0.0000001
  },
  {
    network: 'avalanche',
    name: 'Avalanche',
    icon: '🔺',
    color: '#E84142',
    gasPrice: {
      slow: 25,
      standard: 30,
      fast: 35,
      instant: 45
    },
    gasLimit: {
      transfer: 21000,
      erc20: 65000,
      uniswapSwap: 150000,
      nftMint: 85000
    },
    blockTime: 2,
    congestion: 'medium',
    change24h: -8.9,
    unit: 'nAVAX',
    usdPrice: 0.000042
  }
];

const TRANSACTION_TYPES = [
  { name: 'Simple Transfer', key: 'transfer', description: 'ETH/native token transfer' },
  { name: 'ERC-20 Transfer', key: 'erc20', description: 'Token transfer' },
  { name: 'DEX Swap', key: 'uniswapSwap', description: 'Uniswap/DEX swap' },
  { name: 'NFT Mint', key: 'nftMint', description: 'NFT minting' }
];

export default function GasTrackerPage() {
  const [selectedNetwork, setSelectedNetwork] = useState('ethereum');
  const [gasHistory, setGasHistory] = useState<GasHistoryData[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Generate mock historical gas data
    const generateHistory = () => {
      const history: GasHistoryData[] = [];
      const now = new Date();
      
      for (let i = 23; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000).toISOString();
        const dataPoint: GasHistoryData = { timestamp };
        
        MOCK_GAS_DATA.forEach(network => {
          const baseGas = network.gasPrice.standard;
          const volatility = Math.random() * 0.3 - 0.15; // ±15% volatility
          dataPoint[network.network] = Math.max(1, baseGas * (1 + volatility));
        });
        
        history.push(dataPoint);
      }
      
      setGasHistory(history);
    };
    
    generateHistory();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(generateHistory, 30000);
    return () => clearInterval(interval);
  }, []);

  const refreshGasData = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const calculateTransactionCost = (network: GasData, txType: string, speed: 'slow' | 'standard' | 'fast' | 'instant') => {
    const gasLimit = network.gasLimit[txType as keyof typeof network.gasLimit];
    const gasPrice = network.gasPrice[speed];
    const gasCost = (gasLimit * gasPrice) / 1000000000; // Convert to ETH/native units
    const usdCost = network.usdPrice ? gasCost * network.usdPrice * 1000000000 : 0;
    
    return {
      gas: gasCost,
      usd: usdCost
    };
  };

  const getCongestionColor = (congestion: string) => {
    switch (congestion) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getCongestionIcon = (congestion: string) => {
    switch (congestion) {
      case 'low': return <CheckCircle className="h-4 w-4" />;
      case 'medium': return <AlertTriangle className="h-4 w-4" />;
      case 'high': return <Flame className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const formatGasPrice = (price: number, unit: string) => {
    return `${price.toFixed(price < 1 ? 3 : 0)} ${unit}`;
  };

  const selectedNetworkData = MOCK_GAS_DATA.find(n => n.network === selectedNetwork);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Gas Tracker</h1>
            <p className="text-muted-foreground">
              Real-time gas prices and transaction cost estimates across networks
            </p>
          </div>
          <Button onClick={refreshGasData} disabled={refreshing}>
            {refreshing ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Refreshing...</span>
              </div>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Refresh
              </>
            )}
          </Button>
        </div>

        {/* Network Overview Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {MOCK_GAS_DATA.map((network) => (
            <Card 
              key={network.network} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedNetwork === network.network ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedNetwork(network.network)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{network.icon}</span>
                    <div>
                      <h3 className="font-semibold">{network.name}</h3>
                      <div className={`flex items-center gap-1 text-xs ${getCongestionColor(network.congestion)}`}>
                        {getCongestionIcon(network.congestion)}
                        <span className="capitalize">{network.congestion} congestion</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant={network.change24h >= 0 ? 'default' : 'destructive'}>
                    {network.change24h >= 0 ? '+' : ''}{network.change24h.toFixed(1)}%
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Standard</span>
                    <span className="font-semibold">{formatGasPrice(network.gasPrice.standard, network.unit)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Fast</span>
                    <span className="font-semibold">{formatGasPrice(network.gasPrice.fast, network.unit)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>Block time</span>
                    <span>{network.blockTime}s</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="current" className="space-y-4">
          <TabsList>
            <TabsTrigger value="current">Current Prices</TabsTrigger>
            <TabsTrigger value="calculator">Fee Calculator</TabsTrigger>
            <TabsTrigger value="history">Gas History</TabsTrigger>
            <TabsTrigger value="alerts">Price Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="current">
            {selectedNetworkData && (
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span>{selectedNetworkData.icon}</span>
                      {selectedNetworkData.name} Gas Prices
                    </CardTitle>
                    <CardDescription>Current gas prices for different transaction speeds</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(selectedNetworkData.gasPrice).map(([speed, price]) => (
                        <div key={speed} className="flex items-center justify-between p-3 border rounded">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${
                              speed === 'slow' ? 'bg-green-500' :
                              speed === 'standard' ? 'bg-yellow-500' :
                              speed === 'fast' ? 'bg-orange-500' :
                              'bg-red-500'
                            }`}></div>
                            <div>
                              <p className="font-medium capitalize">{speed}</p>
                              <p className="text-xs text-muted-foreground">
                                ~{speed === 'slow' ? '5-10' : speed === 'standard' ? '2-3' : speed === 'fast' ? '1-2' : '<1'} min
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{formatGasPrice(price, selectedNetworkData.unit)}</p>
                            {selectedNetworkData.usdPrice && (
                              <p className="text-xs text-muted-foreground">
                                ${(price * selectedNetworkData.usdPrice * 21000).toFixed(4)} USD
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {selectedNetworkData.baseFee && (
                      <div className="mt-6 p-4 bg-muted rounded-lg">
                        <h4 className="font-semibold mb-2">EIP-1559 Details</h4>
                        <div className="grid gap-2 text-sm">
                          <div className="flex justify-between">
                            <span>Base Fee:</span>
                            <span>{formatGasPrice(selectedNetworkData.baseFee, selectedNetworkData.unit)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Priority Fee:</span>
                            <span>{formatGasPrice(selectedNetworkData.priorityFee!, selectedNetworkData.unit)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Network Statistics</CardTitle>
                    <CardDescription>Current network performance metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Network Congestion</span>
                          <span className={`text-sm font-medium capitalize ${getCongestionColor(selectedNetworkData.congestion)}`}>
                            {selectedNetworkData.congestion}
                          </span>
                        </div>
                        <Progress 
                          value={selectedNetworkData.congestion === 'low' ? 30 : selectedNetworkData.congestion === 'medium' ? 65 : 90} 
                          className="h-2"
                        />
                      </div>

                      <div className="grid gap-4">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Average Block Time</span>
                          <span className="font-semibold">{selectedNetworkData.blockTime}s</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">24h Change</span>
                          <span className={`font-semibold ${selectedNetworkData.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {selectedNetworkData.change24h >= 0 ? '+' : ''}{selectedNetworkData.change24h.toFixed(2)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Current Trend</span>
                          <div className={`flex items-center gap-1 ${selectedNetworkData.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {selectedNetworkData.change24h >= 0 ? (
                              <TrendingDown className="h-4 w-4" />
                            ) : (
                              <TrendingUp className="h-4 w-4" />
                            )}
                            <span className="text-sm">
                              {selectedNetworkData.change24h >= 0 ? 'Decreasing' : 'Increasing'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                        <div className="flex items-start gap-2">
                          <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                          <div className="text-xs text-blue-700 dark:text-blue-300">
                            <p className="font-medium">Tip:</p>
                            <p>Gas prices typically decrease during off-peak hours (weekends and overnight UTC).</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="calculator">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Fee Calculator</CardTitle>
                <CardDescription>Estimate transaction costs for different operations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 lg:grid-cols-2">
                  <div>
                    <h4 className="font-semibold mb-4">Select Network & Transaction Type</h4>
                    <div className="space-y-4">
                      <div className="grid gap-2 grid-cols-2">
                        {MOCK_GAS_DATA.slice(0, 4).map((network) => (
                          <Button
                            key={network.network}
                            variant={selectedNetwork === network.network ? "default" : "outline"}
                            onClick={() => setSelectedNetwork(network.network)}
                            className="justify-start"
                          >
                            <span className="mr-2">{network.icon}</span>
                            {network.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-4">Transaction Cost Estimates</h4>
                    {selectedNetworkData && (
                      <div className="space-y-4">
                        {TRANSACTION_TYPES.map((txType) => (
                          <div key={txType.key} className="p-4 border rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                              <div>
                                <p className="font-medium">{txType.name}</p>
                                <p className="text-xs text-muted-foreground">{txType.description}</p>
                              </div>
                              <Badge variant="outline">
                                {selectedNetworkData.gasLimit[txType.key as keyof typeof selectedNetworkData.gasLimit].toLocaleString()} gas
                              </Badge>
                            </div>
                            <div className="grid gap-2 text-sm">
                              {Object.entries(selectedNetworkData.gasPrice).map(([speed, _]) => {
                                const cost = calculateTransactionCost(selectedNetworkData, txType.key, speed as any);
                                return (
                                  <div key={speed} className="flex justify-between">
                                    <span className="capitalize text-muted-foreground">{speed}:</span>
                                    <span className="font-medium">
                                      {cost.gas.toFixed(6)} {selectedNetworkData.network === 'ethereum' ? 'ETH' : 'tokens'}
                                      {cost.usd > 0 && ` ($${cost.usd.toFixed(2)})`}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Gas Price History</CardTitle>
                <CardDescription>24-hour gas price trends across networks</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={gasHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="timestamp" 
                      tickFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    />
                    <YAxis tickFormatter={(value) => `${value.toFixed(0)} gwei`} />
                    <Tooltip
                      formatter={(value: number, name: string) => [`${value.toFixed(2)} gwei`, MOCK_GAS_DATA.find(n => n.network === name)?.name || name]}
                      labelFormatter={(timestamp) => new Date(timestamp).toLocaleString()}
                    />
                    {MOCK_GAS_DATA.slice(0, 4).map((network, index) => (
                      <Line
                        key={network.network}
                        type="monotone"
                        dataKey={network.network}
                        stroke={network.color}
                        strokeWidth={2}
                        dot={false}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Price Alerts</CardTitle>
                  <CardDescription>Set up notifications for favorable gas prices</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center py-8">
                      <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
                      <p className="text-muted-foreground text-sm">
                        Set up custom alerts to be notified when gas prices drop below your target levels.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Optimization Tips</CardTitle>
                  <CardDescription>Save on gas fees with these strategies</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-blue-500 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-sm">Time Your Transactions</h4>
                          <p className="text-xs text-muted-foreground">Gas prices are typically lower on weekends and during off-peak hours (2-6 AM UTC).</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-start gap-3">
                        <Gauge className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-sm">Use Layer 2 Solutions</h4>
                          <p className="text-xs text-muted-foreground">Consider Arbitrum, Optimism, or Polygon for significantly lower fees.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-start gap-3">
                        <Zap className="h-5 w-5 text-yellow-500 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-sm">Batch Transactions</h4>
                          <p className="text-xs text-muted-foreground">Group multiple operations together to save on gas costs.</p>
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
