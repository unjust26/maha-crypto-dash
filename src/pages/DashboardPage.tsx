import { useState } from "react";
import { useCryptoPrices } from "@/hooks/useCryptoData";
import { MarketStats } from "@/components/crypto/MarketStats";
import { PriceChart } from "@/components/crypto/PriceChart";
import { CoinTable } from "@/components/crypto/CoinTable";
import { FearGreedGauge } from "@/components/crypto/FearGreedGauge";
import { ConfluencePanel } from "@/components/crypto/ConfluencePanel";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DashboardPage() {
  const { prices, loading, refetch } = useCryptoPrices();
  const [selectedCoin, setSelectedCoin] = useState("bitcoin");
  const [refreshing, setRefreshing] = useState(false);

  const selectedCoinData = prices.find((c) => c.id === selectedCoin);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setTimeout(() => setRefreshing(false), 600);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Real-time crypto market intelligence
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          className="gap-2"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Global market stats */}
      <MarketStats />

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Price chart — spans 2 cols */}
        {loading ? (
          <div className="col-span-full lg:col-span-2">
            <Skeleton className="h-[380px] rounded-xl" />
          </div>
        ) : (
          <PriceChart
            coinId={selectedCoin}
            coinName={selectedCoinData?.name || "Bitcoin"}
            currentPrice={selectedCoinData?.current_price}
            priceChange24h={selectedCoinData?.price_change_percentage_24h}
          />
        )}

        {/* Right sidebar — Fear/Greed + Confluence */}
        <div className="space-y-4">
          <FearGreedGauge />
          <ConfluencePanel />
        </div>
      </div>

      {/* Coin table */}
      {loading ? (
        <Skeleton className="h-[400px] rounded-xl" />
      ) : (
        <CoinTable
          coins={prices}
          selectedCoin={selectedCoin}
          onSelectCoin={setSelectedCoin}
        />
      )}
    </div>
  );
}
