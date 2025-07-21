import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Zap, 
  BarChart3, 
  ArrowUpRight,
  ExternalLink,
  Star,
  Clock,
  DollarSign,
  PieChart,
  Target,
  Wallet
} from "lucide-react";
import Link from "next/link";

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  badge?: string;
  color?: string;
}

const QuickActionCard = ({ title, description, icon, href, badge, color = "bg-primary" }: QuickActionCardProps) => (
  <Link href={href}>
    <Card className="group cursor-pointer transition-all hover:shadow-lg hover:scale-105">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
            {icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold group-hover:text-primary transition-colors">{title}</h3>
              {badge && (
                <Badge variant="secondary" className="text-xs">{badge}</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground overflow-hidden text-ellipsis">{description}</p>
          </div>
          <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </CardContent>
    </Card>
  </Link>
);

interface FeatureCardProps {
  title: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  href: string;
  status?: 'new' | 'updated' | 'coming-soon';
}

const FeatureCard = ({ title, description, features, icon, href, status }: FeatureCardProps) => (
  <Card className="group h-full">
    <CardHeader>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            {status && (
              <Badge 
                variant={status === 'new' ? 'default' : status === 'updated' ? 'secondary' : 'outline'} 
                className="mt-1 text-xs"
              >
                {status === 'new' ? 'New' : status === 'updated' ? 'Updated' : 'Coming Soon'}
              </Badge>
            )}
          </div>
        </div>
      </div>
      <CardDescription className="mt-2">{description}</CardDescription>
    </CardHeader>
    <CardContent>
      <ul className="space-y-2 mb-4">
        {features.map((feature, index) => (
          <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
            {feature}
          </li>
        ))}
      </ul>
      <Link href={href}>
        <Button 
          variant="outline" 
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
          disabled={status === 'coming-soon'}
        >
          {status === 'coming-soon' ? 'Coming Soon' : 'Explore'}
          {status !== 'coming-soon' && <ExternalLink className="ml-2 h-4 w-4" />}
        </Button>
      </Link>
    </CardContent>
  </Card>
);

export default function EnhancedHomePage() {
  const quickActions = [
    {
      title: "Portfolio Analysis",
      description: "Get detailed insights into your crypto holdings with advanced analytics",
      icon: <PieChart className="h-6 w-6" />,
      href: "/advanced-portfolio",
      badge: "Enhanced",
      color: "bg-gradient-to-br from-blue-500 to-blue-600"
    },
    {
      title: "DEX Analytics",
      description: "Track prices and liquidity across multiple decentralized exchanges",
      icon: <BarChart3 className="h-6 w-6" />,
      href: "/dex-analytics",
      badge: "Multi-chain",
      color: "bg-gradient-to-br from-green-500 to-green-600"
    },
    {
      title: "Gas Tracker",
      description: "Monitor real-time gas prices and optimize your transaction timing",
      icon: <Zap className="h-6 w-6" />,
      href: "/gas-tracker",
      badge: "Real-time",
      color: "bg-gradient-to-br from-yellow-500 to-orange-500"
    },
    {
      title: "Token Comparison",
      description: "Compare performance and metrics between different cryptocurrencies",
      icon: <TrendingUp className="h-6 w-6" />,
      href: "/token-comparison",
      badge: "Advanced",
      color: "bg-gradient-to-br from-purple-500 to-purple-600"
    }
  ];

  const features = [
    {
      title: "Multi-Chain Portfolio",
      description: "Comprehensive portfolio tracking across Ethereum, Polygon, BSC, Arbitrum, and more.",
      features: [
        "Cross-chain asset aggregation",
        "Real-time price updates",
        "Performance analytics",
        "Risk assessment tools"
      ],
      icon: <Wallet className="h-5 w-5" />,
      href: "/advanced-portfolio",
      status: 'new' as const
    },
    {
      title: "DEX Price Intelligence",
      description: "Track and analyze prices across major decentralized exchanges with historical data.",
      features: [
        "Multi-DEX price comparison",
        "Liquidity pool analysis",
        "Volume tracking",
        "Arbitrage opportunities"
      ],
      icon: <Activity className="h-5 w-5" />,
      href: "/dex-analytics",
      status: 'new' as const
    },
    {
      title: "Advanced Gas Analytics",
      description: "Intelligent gas price monitoring with predictive insights and optimization tips.",
      features: [
        "Multi-network gas tracking",
        "Price prediction algorithms",
        "Transaction cost calculator",
        "Optimization recommendations"
      ],
      icon: <Zap className="h-5 w-5" />,
      href: "/gas-tracker",
      status: 'updated' as const
    },
    {
      title: "Token Performance Analysis",
      description: "Deep dive into token metrics and performance comparisons.",
      features: [
        "Side-by-side comparisons",
        "Historical performance",
        "Fundamental analysis",
        "Market correlation insights"
      ],
      icon: <Target className="h-5 w-5" />,
      href: "/token-comparison",
      status: 'new' as const
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12 px-4 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Advanced Crypto Analytics Platform
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Track, analyze, and optimize your crypto portfolio with institutional-grade tools
          </p>
          <div className="flex items-center justify-center gap-4">
            <Badge variant="secondary" className="px-3 py-1">
              <Star className="h-4 w-4 mr-1" />
              Multi-chain Support
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              <Clock className="h-4 w-4 mr-1" />
              Real-time Data
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              <DollarSign className="h-4 w-4 mr-1" />
              Cost Optimization
            </Badge>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action, index) => (
            <QuickActionCard key={index} {...action} />
          ))}
        </div>
      </div>

      {/* Feature Showcase */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Platform Features</h2>
          <Badge variant="outline" className="px-3 py-1">
            {features.filter(f => f.status === 'new').length} New Features
          </Badge>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>

      {/* Statistics Section */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2">6+</h3>
            <p className="text-muted-foreground">Supported Blockchains</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Real-time</h3>
            <p className="text-muted-foreground">Price Updates</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
              <Target className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Advanced</h3>
            <p className="text-muted-foreground">Analytics Tools</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
