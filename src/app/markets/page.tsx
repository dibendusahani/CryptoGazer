
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { TokenTable } from "@/components/dashboard/TokenTable";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function MarketsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Markets Overview</CardTitle>
            <CardDescription>Explore current cryptocurrency market data.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Re-using TokenTable, or a more detailed market-specific table can be created */}
            <TokenTable />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
