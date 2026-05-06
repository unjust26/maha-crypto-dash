import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Activity,
  TrendingUp,
  Gauge,
  BarChart,
  Waves,
  Zap,
} from "lucide-react";

interface Signal {
  name: string;
  value: string;
  signal: "bullish" | "bearish" | "neutral";
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

// Simulated confluence signals (in production these would come from MIDAS)
const SIGNALS: Signal[] = [
  {
    name: "RSI (14)",
    value: "52.3",
    signal: "neutral",
    icon: Activity,
    description: "Relative Strength Index — neutral territory",
  },
  {
    name: "MACD",
    value: "Crossover ↑",
    signal: "bullish",
    icon: TrendingUp,
    description: "Moving Average Convergence Divergence — bullish cross",
  },
  {
    name: "EMA 200",
    value: "Above",
    signal: "bullish",
    icon: Waves,
    description: "Price above 200 EMA — long-term uptrend intact",
  },
  {
    name: "ATR",
    value: "Moderate",
    signal: "neutral",
    icon: Gauge,
    description: "Average True Range — moderate volatility",
  },
  {
    name: "ADX",
    value: "28.5",
    signal: "bullish",
    icon: Zap,
    description: "Average Directional Index — trending (>25)",
  },
  {
    name: "Volume",
    value: "Above Avg",
    signal: "bullish",
    icon: BarChart,
    description: "Volume confirmation — above 20-day average",
  },
];

function getSignalColor(signal: string) {
  switch (signal) {
    case "bullish":
      return "text-green-500 bg-green-500/10 border-green-500/20";
    case "bearish":
      return "text-red-500 bg-red-500/10 border-red-500/20";
    default:
      return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
  }
}

function getSignalLabel(signal: string) {
  switch (signal) {
    case "bullish":
      return "BUY";
    case "bearish":
      return "SELL";
    default:
      return "HOLD";
  }
}

export function ConfluencePanel() {
  const bullishCount = SIGNALS.filter((s) => s.signal === "bullish").length;
  const totalSignals = SIGNALS.length;
  const score = Math.round((bullishCount / totalSignals) * 100);

  const overallSignal =
    score >= 65 ? "bullish" : score <= 35 ? "bearish" : "neutral";

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            MIDAS Confluence Score
          </CardTitle>
          <span
            className={cn(
              "px-2 py-0.5 text-xs font-bold rounded-full border",
              getSignalColor(overallSignal)
            )}
          >
            {getSignalLabel(overallSignal)} ({score}/100)
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-2.5 pb-4">
        {/* Score bar */}
        <div className="w-full h-2 bg-muted/50 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-1000 ease-out",
              overallSignal === "bullish"
                ? "bg-green-500"
                : overallSignal === "bearish"
                  ? "bg-red-500"
                  : "bg-yellow-500"
            )}
            style={{ width: `${score}%` }}
          />
        </div>

        {/* Individual signals */}
        <div className="space-y-1.5">
          {SIGNALS.map((signal) => (
            <div
              key={signal.name}
              className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-muted/30 transition-colors group"
              title={signal.description}
            >
              <div className="flex items-center gap-2">
                <signal.icon className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs font-medium">{signal.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs tabular-nums text-muted-foreground">
                  {signal.value}
                </span>
                <span
                  className={cn(
                    "w-2 h-2 rounded-full",
                    signal.signal === "bullish"
                      ? "bg-green-500"
                      : signal.signal === "bearish"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                  )}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
