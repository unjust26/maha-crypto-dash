import type { CoinPrice } from "@/hooks/useCryptoData";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface CoinTableProps {
  coins: CoinPrice[];
  selectedCoin: string;
  onSelectCoin: (id: string) => void;
}

function MiniSparkline({ data, positive }: { data: number[]; positive: boolean }) {
  if (!data || data.length === 0) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 80;
  const height = 28;

  const points = data
    .filter((_, i) => i % Math.max(1, Math.floor(data.length / 30)) === 0)
    .map((v, i, arr) => {
      const x = (i / (arr.length - 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} className="flex-shrink-0">
      <polyline
        points={points}
        fill="none"
        stroke={positive ? "#22c55e" : "#ef4444"}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function formatCompact(num: number): string {
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  return `$${num.toLocaleString()}`;
}

export function CoinTable({ coins, selectedCoin, onSelectCoin }: CoinTableProps) {
  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur col-span-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Market Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2.5">#</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2.5">Coin</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-4 py-2.5">Price</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-4 py-2.5">24h</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-4 py-2.5 hidden sm:table-cell">7d</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-4 py-2.5 hidden md:table-cell">Market Cap</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-4 py-2.5 hidden lg:table-cell">Volume (24h)</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-4 py-2.5 hidden md:table-cell">7d Chart</th>
              </tr>
            </thead>
            <tbody>
              {coins.map((coin) => {
                const is24hPositive = coin.price_change_percentage_24h >= 0;
                const is7dPositive = (coin.price_change_percentage_7d_in_currency || 0) >= 0;
                const isSelected = selectedCoin === coin.id;

                return (
                  <tr
                    key={coin.id}
                    onClick={() => onSelectCoin(coin.id)}
                    className={cn(
                      "border-b border-border/30 cursor-pointer transition-colors",
                      isSelected
                        ? "bg-primary/5"
                        : "hover:bg-muted/30"
                    )}
                  >
                    <td className="px-4 py-3 text-sm text-muted-foreground tabular-nums">
                      {coin.market_cap_rank}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={coin.image}
                          alt={coin.name}
                          className="w-7 h-7 rounded-full"
                          loading="lazy"
                        />
                        <div>
                          <p className="text-sm font-medium">{coin.name}</p>
                          <p className="text-xs text-muted-foreground uppercase">
                            {coin.symbol}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-medium tabular-nums">
                      ${coin.current_price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: coin.current_price < 1 ? 6 : 2,
                      })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div
                        className={cn(
                          "inline-flex items-center gap-1 text-sm font-medium tabular-nums",
                          is24hPositive ? "text-green-500" : "text-red-500"
                        )}
                      >
                        {is24hPositive ? (
                          <TrendingUp className="w-3.5 h-3.5" />
                        ) : (
                          <TrendingDown className="w-3.5 h-3.5" />
                        )}
                        {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right hidden sm:table-cell">
                      <span
                        className={cn(
                          "text-sm font-medium tabular-nums",
                          is7dPositive ? "text-green-500" : "text-red-500"
                        )}
                      >
                        {is7dPositive ? "+" : ""}
                        {(coin.price_change_percentage_7d_in_currency || 0).toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-sm tabular-nums text-muted-foreground hidden md:table-cell">
                      {formatCompact(coin.market_cap)}
                    </td>
                    <td className="px-4 py-3 text-right text-sm tabular-nums text-muted-foreground hidden lg:table-cell">
                      {formatCompact(coin.total_volume)}
                    </td>
                    <td className="px-4 py-3 text-right hidden md:table-cell">
                      <div className="flex justify-end">
                        <MiniSparkline
                          data={coin.sparkline_in_7d?.price || []}
                          positive={is7dPositive}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
