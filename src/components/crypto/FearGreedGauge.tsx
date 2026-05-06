import { useFearGreed } from "@/hooks/useCryptoData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function getGaugeColor(value: number): string {
  if (value <= 20) return "#ef4444"; // Extreme Fear - red
  if (value <= 40) return "#f97316"; // Fear - orange
  if (value <= 60) return "#eab308"; // Neutral - yellow
  if (value <= 80) return "#84cc16"; // Greed - lime
  return "#22c55e"; // Extreme Greed - green
}

function getGaugeGradient(value: number): string {
  if (value <= 20) return "from-red-500/20 to-red-500/5";
  if (value <= 40) return "from-orange-500/20 to-orange-500/5";
  if (value <= 60) return "from-yellow-500/20 to-yellow-500/5";
  if (value <= 80) return "from-lime-500/20 to-lime-500/5";
  return "from-green-500/20 to-green-500/5";
}

export function FearGreedGauge() {
  const { data, loading } = useFearGreed();

  if (loading) {
    return (
      <Card className="border-border/50 bg-card/80 backdrop-blur">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Fear & Greed Index
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Skeleton className="h-32 w-32 rounded-full" />
        </CardContent>
      </Card>
    );
  }

  const value = data?.value || 50;
  const color = getGaugeColor(value);
  const gradientClasses = getGaugeGradient(value);
  const rotation = (value / 100) * 180 - 90; // -90 to 90 degrees

  return (
    <Card className={`border-border/50 bg-gradient-to-b ${gradientClasses} backdrop-blur`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Fear & Greed Index
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-3 pb-4">
        {/* Gauge SVG */}
        <div className="relative w-40 h-24">
          <svg viewBox="0 0 200 110" className="w-full h-full">
            {/* Background arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="12"
              strokeLinecap="round"
              className="text-muted/30"
            />
            {/* Colored gradient arc segments */}
            <defs>
              <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="25%" stopColor="#f97316" />
                <stop offset="50%" stopColor="#eab308" />
                <stop offset="75%" stopColor="#84cc16" />
                <stop offset="100%" stopColor="#22c55e" />
              </linearGradient>
            </defs>
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="url(#gaugeGrad)"
              strokeWidth="12"
              strokeLinecap="round"
              opacity="0.3"
            />
            {/* Needle */}
            <g transform={`rotate(${rotation}, 100, 100)`}>
              <line
                x1="100"
                y1="100"
                x2="100"
                y2="30"
                stroke={color}
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="100" cy="100" r="6" fill={color} />
            </g>
          </svg>
        </div>

        {/* Value */}
        <div className="text-center -mt-2">
          <span
            className="text-4xl font-bold tabular-nums"
            style={{ color }}
          >
            {value}
          </span>
          <p className="text-sm font-medium mt-1" style={{ color }}>
            {data?.classification || "Neutral"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
