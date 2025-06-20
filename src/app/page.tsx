import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Header } from "@/components/dashboard/Header";
import { PortfolioOverview } from "@/components/dashboard/PortfolioOverview";
import { PortfolioPerformanceChart } from "@/components/dashboard/PortfolioPerformanceChart";
import { StatCard } from "@/components/dashboard/StatCard";
import { TokenTable } from "@/components/dashboard/TokenTable";
import { TrendingUp, Zap, Globe, Activity } from "lucide-react"; // Using Activity for Fear & Greed

// Mock data for Fear & Greed Index and Market Cap
const mockFearAndGreed = {
  value: 72,
  classification: "Greed",
};

const mockMarketCap = {
  value: 2.3, // In Trillions
  change: "+1.5%",
};

export default function HomePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Global Market Cap"
            value={`$${mockMarketCap.value}T`}
            icon={Globe}
            description="Total value of all cryptocurrencies."
            change={mockMarketCap.change}
            changeColor={mockMarketCap.change.startsWith('+') ? "hsl(var(--chart-1))" : "hsl(var(--destructive))"}
          />
          <StatCard
            title="Fear & Greed Index"
            value={mockFearAndGreed.value}
            icon={Activity} // Using Activity as a proxy for sentiment
            description={mockFearAndGreed.classification}
          />
           <StatCard
            title="24h Volume"
            value="$120B"
            icon={TrendingUp}
            description="Total crypto volume traded in 24h."
            change="+5.2%"
            changeColor={"hsl(var(--chart-1))"}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <PortfolioOverview />
          </div>
          <div className="lg:col-span-2">
            <PortfolioPerformanceChart />
          </div>
        </div>

        <div>
          <TokenTable />
        </div>
      </div>
    </DashboardLayout>
  );
}
