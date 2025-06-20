
"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Token } from "@/lib/types";
import { Coins, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Helper function to format large numbers
const formatMarketCap = (value: number | string): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return "N/A";
  if (num >= 1_000_000_000_000) {
    return `$${(num / 1_000_000_000_000).toFixed(2)}T`;
  }
  if (num >= 1_000_000_000) {
    return `$${(num / 1_000_000_000).toFixed(2)}B`;
  }
  if (num >= 1_000_000) {
    return `$${(num / 1_000_000).toFixed(2)}M`;
  }
  return `$${num.toFixed(2)}`;
};

const COINCAP_API_KEY = "357c8a999b5262f845924985cc5c50408d6f0413ab6e3dadbb5cd32118c9a98e";

export function TokenTable() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokens = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("https://api.coincap.io/v2/assets?limit=20", {
          headers: {
            'Authorization': `Bearer ${COINCAP_API_KEY}`
          }
        });
        
        if (!response.ok) {
          let errorText = response.statusText;
          try {
            const errorData = await response.json();
            if (errorData && (errorData.error || errorData.message)) {
              errorText = errorData.error || errorData.message;
            }
          } catch (e) {
            // Ignore if response body is not JSON or empty
          }
          throw new Error(`Failed to fetch tokens: ${response.status} ${errorText}`);
        }
        const data = await response.json();
        if (data && data.data) {
          const fetchedTokens: Token[] = data.data.map((token: any) => ({
            ...token,
            iconUrl: `https://assets.coincap.io/assets/icons/${token.symbol.toLowerCase()}@2x.png`
          }));
          setTokens(fetchedTokens);
        } else {
          throw new Error("No token data found in API response");
        }
      } catch (err) {
        let message = "An unknown error occurred while fetching token data.";
        if (err instanceof Error) {
          message = err.message;
        } else if (typeof err === 'string') {
          message = err;
        }
        setError(message);
        console.error("TokenTable fetch error details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, []);

  if (error) {
    return (
      <Card className="shadow-lg col-span-1 md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle className="font-headline text-xl">Cryptocurrency Prices</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px] flex flex-col items-center justify-center">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <p className="text-destructive font-semibold">Could not load token data.</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="shadow-lg col-span-1 md:col-span-2 lg:col-span-3">
      <CardHeader>
        <CardTitle className="font-headline text-xl">Cryptocurrency Prices</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">24h Change</TableHead>
                <TableHead className="text-right hidden sm:table-cell">Market Cap</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && Array.from({ length: 10 }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell><Skeleton className="h-6 w-6 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell className="text-right hidden sm:table-cell"><Skeleton className="h-4 w-28" /></TableCell>
                </TableRow>
              ))}
              {!loading && tokens.map((token) => {
                const price = parseFloat(token.priceUsd);
                const change24h = parseFloat(token.changePercent24Hr);
                const marketCap = parseFloat(token.marketCapUsd);

                return (
                  <TableRow key={token.id} className="hover:bg-muted/50 transition-colors duration-150">
                    <TableCell>
                      {token.iconUrl ? (
                        <Image 
                          src={token.iconUrl} 
                          alt={token.name} 
                          width={24} 
                          height={24} 
                          className="rounded-full" 
                          data-ai-hint={`${token.symbol.toLowerCase()} logo`}
                          onError={(e) => {
                             const target = e.target as HTMLImageElement;
                             target.onerror = null; 
                             target.src = "https://placehold.co/24x24.png"; 
                             target.dataset.aiHint = "placeholder icon";
                          }}
                        />
                      ) : (
                        <Coins className="h-6 w-6 text-muted-foreground" />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{token.name}</TableCell>
                    <TableCell className="text-muted-foreground">{token.symbol}</TableCell>
                    <TableCell className="text-right">
                      {!isNaN(price) ? `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "N/A"}
                    </TableCell>
                    <TableCell className={`text-right ${!isNaN(change24h) && change24h >= 0 ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"}`}>
                      {!isNaN(change24h) ? `${change24h >= 0 ? "+" : ""}${change24h.toFixed(2)}%` : "N/A"}
                    </TableCell>
                    <TableCell className="text-right hidden sm:table-cell">
                      {!isNaN(marketCap) ? formatMarketCap(marketCap) : "N/A"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
