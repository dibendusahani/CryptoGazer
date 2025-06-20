"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PortfolioOverview } from "@/components/dashboard/PortfolioOverview";
import { PortfolioPerformanceChart } from "@/components/dashboard/PortfolioPerformanceChart";
import { StatCard } from "@/components/dashboard/StatCard";
import { TokenTable } from "@/components/dashboard/TokenTable";
import { TrendingUp, Globe, Activity } from "lucide-react";
import type { GlobalMarketResponse, FearAndGreedIndexResponse, GlobalMarketData, FearAndGreedIndexData } from "@/lib/types";

const formatCompactNumber = (value: number | undefined): string => {
  if (value === undefined || isNaN(value)) return "Loading...";
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export default function HomePage() {
  const [globalMarketData, setGlobalMarketData] = useState<GlobalMarketData | null>(null);
  const [fearAndGreed, setFearAndGreed] = useState<FearAndGreedIndexData | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [errorStats, setErrorStats] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoadingStats(true);
      setErrorStats(null);
      try {
        const [globalRes, fngRes] = await Promise.all([
          fetch("https://api.alternative.me/v2/global/"),
          fetch("https://api.alternative.me/fng/?limit=1")
        ]);

        if (!globalRes.ok) throw new Error(`Failed to fetch global market data: ${globalRes.statusText}`);
        if (!fngRes.ok) throw new Error(`Failed to fetch Fear & Greed Index: ${fngRes.statusText}`);

        const globalData: GlobalMarketResponse = await globalRes.json();
        const fngData: FearAndGreedIndexResponse = await fngRes.json();

        if (globalData.data) {
          setGlobalMarketData(globalData.data);
        } else {
          throw new Error("No global data found in API response");
        }
        
        if (fngData.data && fngData.data.length > 0) {
          setFearAndGreed(fngData.data[0]);
        } else {
          throw new Error("No Fear & Greed data found in API response");
        }

      } catch (err) {
        if (err instanceof Error) {
          setErrorStats(err.message);
        } else {
          setErrorStats("An unknown error occurred while fetching stats.");
        }
        console.error(err);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  const marketCapChange = globalMarketData?.market_cap_change_percentage_24h_usd;
  const marketCapChangeString = marketCapChange !== undefined 
    ? `${marketCapChange >= 0 ? '+' : ''}${marketCapChange.toFixed(1)}%`
    : "Loading...";
  const marketCapChangeColor = marketCapChange !== undefined 
    ? (marketCapChange >= 0 ? "hsl(var(--chart-1))" : "hsl(var(--destructive))")
    : "hsl(var(--muted-foreground))";


  return (
    <DashboardLayout>
      <div className="space-y-6">
        {errorStats && (
          <div className="p-4 bg-destructive/10 text-destructive border border-destructive rounded-md">
            <p className="font-semibold">Error loading dashboard statistics:</p>
            <p className="text-sm">{errorStats}</p>
          </div>
        )}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Global Market Cap"
            value={loadingStats ? "Loading..." : formatCompactNumber(globalMarketData?.total_market_cap.usd)}
            icon={Globe}
            description="Total value of all cryptocurrencies."
            change={loadingStats ? "" : marketCapChangeString}
            changeColor={loadingStats ? "hsl(var(--muted-foreground))" : marketCapChangeColor}
          />
          <StatCard
            title="Fear & Greed Index"
            value={loadingStats ? "Loading..." : (fearAndGreed?.value || "N/A")}
            icon={Activity} 
            description={loadingStats ? "Loading..." : (fearAndGreed?.value_classification || "N/A")}
          />
           <StatCard
            title="24h Volume"
            value={loadingStats ? "Loading..." : formatCompactNumber(globalMarketData?.total_volume_24h.usd)}
            icon={TrendingUp}
            description="Total crypto volume traded in 24h."
            // No direct 24h volume change % from this specific global endpoint, so we omit it or find another source
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
