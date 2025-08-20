
"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PortfolioOverview } from "@/components/dashboard/PortfolioOverview";
import { PortfolioPerformanceChart } from "@/components/dashboard/PortfolioPerformanceChart";
import { StatCard } from "@/components/dashboard/StatCard";
import { TokenTable } from "@/components/dashboard/TokenTable";
import EnhancedHomePage from "@/components/dashboard/EnhancedHomePage";
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
        console.log("[Alternative.me] Global API response status:", globalRes.status);
        console.log("[Alternative.me] F&G API response status:", fngRes.status);

        if (!globalRes.ok) {
          let errorText = `Alternative.me Global API: ${globalRes.status}`;
          try {
            const errorData = await globalRes.json();
            if (errorData && errorData.metadata && errorData.metadata.error) {
              errorText += ` - ${errorData.metadata.error}`;
            } else if (errorData && (errorData.error || errorData.message)) {
              errorText += ` - ${errorData.error || errorData.message}`;
            } else {
              errorText += ` - ${globalRes.statusText}`;
            }
          } catch (e) { errorText += ` - ${globalRes.statusText}`; }
          throw new Error(errorText);
        }
        if (!fngRes.ok) {
          let errorText = `Alternative.me F&G API: ${fngRes.status}`;
          try {
            const errorData = await fngRes.json();
            if (errorData && errorData.metadata && errorData.metadata.error) {
              errorText += ` - ${errorData.metadata.error}`;
            } else if (errorData && (errorData.error || errorData.message)) {
              errorText += ` - ${errorData.error || errorData.message}`;
            } else {
              errorText += ` - ${fngRes.statusText}`;
            }
          } catch (e) { errorText += ` - ${fngRes.statusText}`; }
          throw new Error(errorText);
        }

        const globalData: any = await globalRes.json();
        const fngData: FearAndGreedIndexResponse = await fngRes.json();
        console.log("[Alternative.me] Global API data:", globalData);
        console.log("[Alternative.me] F&G API data:", fngData);

        if (globalData.data) {
          // Transform the new API structure to match expected format
          const transformedGlobalData: GlobalMarketData = {
            active_cryptocurrencies: globalData.data.active_cryptocurrencies || 0,
            upcoming_icos: 0, // Not provided in new API
            ongoing_icos: 0, // Not provided in new API
            ended_icos: 0, // Not provided in new API
            markets: globalData.data.active_markets || 0,
            total_market_cap: globalData.data.quotes?.USD ? { usd: globalData.data.quotes.USD.total_market_cap } : {},
            total_volume_24h: globalData.data.quotes?.USD ? { usd: globalData.data.quotes.USD.total_volume_24h } : {},
            market_cap_percentage: { btc: globalData.data.bitcoin_percentage_of_market_cap * 100 || 0 },
            market_cap_change_percentage_24h_usd: 0, // Not provided in new API
            updated_at: globalData.data.last_updated || 0
          };
          setGlobalMarketData(transformedGlobalData);
        } else {
          throw new Error("No global data found in Alternative.me API response");
        }
        
        if (fngData.data && fngData.data.length > 0) {
          setFearAndGreed(fngData.data[0]);
        } else {
          throw new Error("No Fear & Greed data found in Alternative.me API response");
        }

      } catch (err) {
        let message = "An unknown error occurred while fetching dashboard statistics.";
        if (err instanceof Error) {
          if (err.message.toLowerCase().includes("failed to fetch")) {
            message = "Failed to connect to statistics services (api.alternative.me). Please check your internet connection or the API's status. This API does not require a key.";
          } else {
            message = err.message;
          }
        } else if (typeof err === 'string') {
          message = err;
        }
        setErrorStats(message);
        console.error("HomePage fetchStats error details:", err);
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
        {/* Enhanced Home Page */}
        <EnhancedHomePage />
        
        {/* API Status and Statistics */}
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
