
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function PortfolioOverviewPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Portfolio Overview</CardTitle>
            <CardDescription>View and manage your portfolio details.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Portfolio overview content will go here.</p>
            {/* Placeholder for portfolio details, charts, etc. */}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
