import { useGlobalMarketData } from "@/hooks/useCryptoData";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Globe,
  BarChart3,
  Bitcoin,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

function formatCompact(num: number): string {
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
  return `$${num.toLocaleString()}`;
}

export function MarketStats() {
  const data = useGlobalMarketData();

  if (!data) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-border/50 bg-card/80 backdrop-blur">
            <CardContent className="p-4">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-7 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const isMarketUp = data.market_cap_change_percentage_24h >= 0;

  const stats = [
    {
      label: "Total Market Cap",
      value: formatCompact(data.total_market_cap),
      icon: Globe,
      change: `${isMarketUp ? "+" : ""}${data.market_cap_change_percentage_24h}%`,
      positive: isMarketUp,
    },
    {
      label: "24h Volume",
      value: formatCompact(data.total_volume),
      icon: BarChart3,
    },
    {
      label: "BTC Dominance",
      value: `${data.btc_dominance}%`,
      icon: Bitcoin,
    },
    {
      label: "Active Coins",
      value: data.active_cryptocurrencies.toLocaleString(),
      icon: TrendingUp,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className="border-border/50 bg-card/80 backdrop-blur hover:bg-card/90 transition-colors"
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1.5">
              <stat.icon className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">{stat.label}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold tabular-nums">
                {stat.value}
              </span>
              {stat.change && (
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 text-xs font-medium tabular-nums",
                    stat.positive ? "text-green-500" : "text-red-500"
                  )}
                >
                  {stat.positive ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {stat.change}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
