import Image from "next/image";
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
import { Coins } from "lucide-react";

const mockTokens: Token[] = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC", price: 60000, change24h: 2.5, marketCap: 1200000000000, iconUrl: "https://placehold.co/32x32.png" },
  { id: "ethereum", name: "Ethereum", symbol: "ETH", price: 3000, change24h: -1.2, marketCap: 360000000000, iconUrl: "https://placehold.co/32x32.png" },
  { id: "solana", name: "Solana", symbol: "SOL", price: 150, change24h: 5.7, marketCap: 70000000000, iconUrl: "https://placehold.co/32x32.png" },
  { id: "dogecoin", name: "Dogecoin", symbol: "DOGE", price: 0.15, change24h: 10.1, marketCap: 20000000000, iconUrl: "https://placehold.co/32x32.png" },
  { id: "cardano", name: "Cardano", symbol: "ADA", price: 0.45, change24h: 0.5, marketCap: 16000000000, iconUrl: "https://placehold.co/32x32.png" },
];

export function TokenTable() {
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
              {mockTokens.map((token) => (
                <TableRow key={token.id} className="hover:bg-muted/50 transition-colors duration-150">
                  <TableCell>
                    {token.iconUrl ? (
                      <Image src={token.iconUrl} alt={token.name} width={24} height={24} className="rounded-full" data-ai-hint={`${token.name} logo`} />
                    ) : (
                      <Coins className="h-6 w-6 text-muted-foreground" />
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{token.name}</TableCell>
                  <TableCell className="text-muted-foreground">{token.symbol}</TableCell>
                  <TableCell className="text-right">${token.price.toLocaleString()}</TableCell>
                  <TableCell className={`text-right ${token.change24h >= 0 ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"}`}>
                    {token.change24h >= 0 ? "+" : ""}{token.change24h.toFixed(1)}%
                  </TableCell>
                  <TableCell className="text-right hidden sm:table-cell">${token.marketCap.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
