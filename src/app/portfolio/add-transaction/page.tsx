
"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, CalendarIcon } from "lucide-react";
import { 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Repeat, 
  Search,
  Wallet,
  Building,
  AlertCircle,
  Check,
  TrendingUp,
  Calculator
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface Token {
  symbol: string;
  name: string;
  price: number;
  logo?: string;
}

interface Transaction {
  id: string;
  type: 'buy' | 'sell' | 'transfer';
  token: Token;
  amount: number;
  price: number;
  value: number;
  fee?: number;
  exchange?: string;
  date: Date;
  notes?: string;
}

export default function AddTransactionPage() {
  const [transactionType, setTransactionType] = useState<'buy' | 'sell' | 'transfer'>('buy');
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [fee, setFee] = useState('');
  const [exchange, setExchange] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [notes, setNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Mock token data
  const popularTokens: Token[] = [
    { symbol: 'BTC', name: 'Bitcoin', price: 67234.31 },
    { symbol: 'ETH', name: 'Ethereum', price: 2850.13 },
    { symbol: 'SOL', name: 'Solana', price: 187.37 },
    { symbol: 'AVAX', name: 'Avalanche', price: 42.67 },
    { symbol: 'LINK', name: 'Chainlink', price: 16.89 },
    { symbol: 'ADA', name: 'Cardano', price: 0.45 },
    { symbol: 'DOT', name: 'Polkadot', price: 7.23 },
    { symbol: 'MATIC', name: 'Polygon', price: 0.89 },
    { symbol: 'UNI', name: 'Uniswap', price: 8.45 },
    { symbol: 'AAVE', name: 'Aave', price: 156.78 }
  ];

  const exchanges = [
    'Binance', 'Coinbase', 'Kraken', 'Bybit', 'KuCoin', 
    'Huobi', 'OKX', 'Gate.io', 'Uniswap', 'PancakeSwap', 'Other'
  ];

  const filteredTokens = popularTokens.filter(token =>
    token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    token.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateValue = () => {
    const amountNum = parseFloat(amount) || 0;
    const priceNum = parseFloat(price) || 0;
    return amountNum * priceNum;
  };

  const handleTokenSelect = (token: Token) => {
    setSelectedToken(token);
    setPrice(token.price.toString());
    setSearchTerm('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedToken || !amount || !price) return;

    setIsSubmitting(true);
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const transaction: Transaction = {
      id: Date.now().toString(),
      type: transactionType,
      token: selectedToken,
      amount: parseFloat(amount),
      price: parseFloat(price),
      value: calculateValue(),
      fee: fee ? parseFloat(fee) : undefined,
      exchange: exchange || undefined,
      date,
      notes: notes || undefined
    };

    console.log('Transaction added:', transaction);
    
    setIsSubmitting(false);
    setShowSuccess(true);
    
    // Reset form
    setTimeout(() => {
      setSelectedToken(null);
      setAmount('');
      setPrice('');
      setFee('');
      setExchange('');
      setNotes('');
      setShowSuccess(false);
    }, 2000);
  };

  const getTransactionIcon = () => {
    switch (transactionType) {
      case 'buy':
        return <ArrowDownLeft className="h-4 w-4" />;
      case 'sell':
        return <ArrowUpRight className="h-4 w-4" />;
      case 'transfer':
        return <Repeat className="h-4 w-4" />;
      default:
        return <Plus className="h-4 w-4" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Add Transaction</h1>
          <p className="text-muted-foreground">
            Record your cryptocurrency transactions for accurate portfolio tracking
          </p>
        </div>

        {showSuccess && (
          <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
            <Check className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700 dark:text-green-300">
              Transaction added successfully!
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Details</CardTitle>
                <CardDescription>
                  Enter the details of your cryptocurrency transaction
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Transaction Type */}
                  <div className="space-y-2">
                    <Label>Transaction Type</Label>
                    <div className="flex gap-2">
                      {[
                        { value: 'buy', label: 'Buy', icon: ArrowDownLeft, color: 'bg-green-500' },
                        { value: 'sell', label: 'Sell', icon: ArrowUpRight, color: 'bg-red-500' },
                        { value: 'transfer', label: 'Transfer', icon: Repeat, color: 'bg-blue-500' }
                      ].map(({ value, label, icon: Icon, color }) => (
                        <Button
                          key={value}
                          type="button"
                          variant={transactionType === value ? "default" : "outline"}
                          onClick={() => setTransactionType(value as any)}
                          className="flex-1"
                        >
                          <Icon className="h-4 w-4 mr-2" />
                          {label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Token Selection */}
                  <div className="space-y-2">
                    <Label>Select Token</Label>
                    <div className="relative">
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search for a token..."
                            value={selectedToken ? `${selectedToken.symbol} - ${selectedToken.name}` : searchTerm}
                            onChange={(e) => {
                              if (selectedToken) {
                                setSelectedToken(null);
                                setPrice('');
                              }
                              setSearchTerm(e.target.value);
                            }}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      
                      {/* Token Dropdown */}
                      {searchTerm && !selectedToken && filteredTokens.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
                          {filteredTokens.map((token) => (
                            <button
                              key={token.symbol}
                              type="button"
                              onClick={() => handleTokenSelect(token)}
                              className="w-full px-4 py-3 text-left hover:bg-muted flex items-center justify-between"
                            >
                              <div>
                                <div className="font-medium">{token.symbol}</div>
                                <div className="text-sm text-muted-foreground">{token.name}</div>
                              </div>
                              <div className="text-right">
                                <div className="font-medium">${token.price.toLocaleString()}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Popular Tokens */}
                    {!searchTerm && !selectedToken && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Popular tokens:</p>
                        <div className="flex flex-wrap gap-2">
                          {popularTokens.slice(0, 6).map((token) => (
                            <Badge
                              key={token.symbol}
                              variant="outline"
                              className="cursor-pointer hover:bg-muted"
                              onClick={() => handleTokenSelect(token)}
                            >
                              {token.symbol}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Amount and Price */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="amount">
                        Amount {selectedToken && `(${selectedToken.symbol})`}
                      </Label>
                      <Input
                        id="amount"
                        type="number"
                        step="any"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Price per Token (USD)</Label>
                      <Input
                        id="price"
                        type="number"
                        step="any"
                        placeholder="0.00"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Total Value */}
                  {amount && price && (
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Total Value:</span>
                        <span className="text-lg font-bold">
                          ${calculateValue().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Fee and Exchange */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fee">Fee (Optional)</Label>
                      <Input
                        id="fee"
                        type="number"
                        step="any"
                        placeholder="0.00"
                        value={fee}
                        onChange={(e) => setFee(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Exchange</Label>
                      <Select value={exchange} onValueChange={setExchange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select exchange" />
                        </SelectTrigger>
                        <SelectContent>
                          {exchanges.map((exchangeName) => (
                            <SelectItem key={exchangeName} value={exchangeName}>
                              {exchangeName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Date and Notes */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Transaction Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <input
                            type="date"
                            value={date ? format(date, 'yyyy-MM-dd') : ''}
                            onChange={(e) => setDate(new Date(e.target.value))}
                            className="p-3 border rounded"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes (Optional)</Label>
                      <Input
                        id="notes"
                        placeholder="Add any notes about this transaction..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={!selectedToken || !amount || !price || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>Processing...</>
                    ) : (
                      <>
                        {getTransactionIcon()}
                        <span className="ml-2">Add Transaction</span>
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Portfolio</span>
                  <span className="font-semibold">$45,420</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Today's Change</span>
                  <span className="font-semibold text-green-600">+$1,230</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Holdings</span>
                  <span className="font-semibold">5 assets</span>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>• Record transactions promptly for accurate tracking</p>
                <p>• Include fees to get precise portfolio value</p>
                <p>• Use notes to remember important details</p>
                <p>• Double-check token symbols and amounts</p>
              </CardContent>
            </Card>

            {/* Recent Transactions Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <div className="flex items-center gap-2">
                      <ArrowDownLeft className="h-3 w-3 text-green-600" />
                      <span>BTC</span>
                    </div>
                    <span>+0.025</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <div className="flex items-center gap-2">
                      <ArrowDownLeft className="h-3 w-3 text-green-600" />
                      <span>ETH</span>
                    </div>
                    <span>+1.5</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <div className="flex items-center gap-2">
                      <ArrowUpRight className="h-3 w-3 text-red-600" />
                      <span>SOL</span>
                    </div>
                    <span>-5.0</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
