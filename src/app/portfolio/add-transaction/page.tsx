
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AddTransactionPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Add New Transaction</CardTitle>
            <CardDescription>Log a new cryptocurrency transaction to your portfolio.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="token">Token</Label>
              <Select>
                <SelectTrigger id="token">
                  <SelectValue placeholder="Select token" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="btc">Bitcoin (BTC)</SelectItem>
                  <SelectItem value="eth">Ethereum (ETH)</SelectItem>
                  <SelectItem value="sol">Solana (SOL)</SelectItem>
                  {/* Add more tokens as needed */}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="type">Transaction Type</Label>
              <Select>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buy">Buy</SelectItem>
                  <SelectItem value="sell">Sell</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" type="number" placeholder="e.g., 0.5" />
            </div>
            <div>
              <Label htmlFor="price">Price per Token (USD)</Label>
              <Input id="price" type="number" placeholder="e.g., 60000" />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" />
            </div>
            <Button className="w-full">Add Transaction</Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
