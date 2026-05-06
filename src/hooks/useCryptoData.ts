import { useState, useEffect, useCallback } from "react";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";

export interface CoinPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency: number;
  market_cap: number;
  total_volume: number;
  sparkline_in_7d: { price: number[] };
  image: string;
  high_24h: number;
  low_24h: number;
  ath: number;
  ath_change_percentage: number;
  circulating_supply: number;
  market_cap_rank: number;
}

export interface FearGreedData {
  value: number;
  classification: string;
  timestamp: string;
}

export interface ChartDataPoint {
  time: string;
  price: number;
  timestamp: number;
}

export function useCryptoPrices() {
  const [prices, setPrices] = useState<CoinPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const getPrices = useAction(api.crypto.getPrices);

  const fetchPrices = useCallback(async () => {
    try {
      const data = await getPrices();
      if (Array.isArray(data) && data.length > 0) {
        setPrices(data);
        setError(null);
      }
    } catch (e) {
      setError("Failed to fetch prices");
    } finally {
      setLoading(false);
    }
  }, [getPrices]);

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, [fetchPrices]);

  return { prices, loading, error, refetch: fetchPrices };
}

export function useFearGreed() {
  const [data, setData] = useState<FearGreedData | null>(null);
  const [history, setHistory] = useState<FearGreedData[]>([]);
  const [loading, setLoading] = useState(true);
  const getFearGreed = useAction(api.crypto.getFearGreed);

  useEffect(() => {
    async function fetch_fg() {
      try {
        const json = await getFearGreed();
        if (json.data && json.data.length > 0) {
          setData({
            value: parseInt(json.data[0].value),
            classification: json.data[0].value_classification,
            timestamp: json.data[0].timestamp,
          });
          setHistory(
            json.data.map((d: { value: string; value_classification: string; timestamp: string }) => ({
              value: parseInt(d.value),
              classification: d.value_classification,
              timestamp: d.timestamp,
            }))
          );
        }
      } catch {
        // Silent fail
      } finally {
        setLoading(false);
      }
    }
    fetch_fg();
  }, [getFearGreed]);

  return { data, history, loading };
}

export function usePriceChart(coinId: string, days: number = 7) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const getChart = useAction(api.crypto.getChart);

  useEffect(() => {
    async function fetchChart() {
      setLoading(true);
      try {
        const data = await getChart({ coinId, days });
        if (data.prices && data.prices.length > 0) {
          const points: ChartDataPoint[] = data.prices.map(
            ([timestamp, price]: [number, number]) => ({
              timestamp,
              time: new Date(timestamp).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                ...(days <= 1 ? { hour: "2-digit", minute: "2-digit" } : {}),
              }),
              price: Math.round(price * 100) / 100,
            })
          );
          const step = Math.max(1, Math.floor(points.length / 100));
          setChartData(points.filter((_, i) => i % step === 0));
        }
      } catch {
        // Keep stale data
      } finally {
        setLoading(false);
      }
    }
    fetchChart();
  }, [coinId, days, getChart]);

  return { chartData, loading };
}

export function useGlobalMarketData() {
  const [data, setData] = useState<{
    total_market_cap: number;
    total_volume: number;
    btc_dominance: number;
    eth_dominance: number;
    active_cryptocurrencies: number;
    market_cap_change_percentage_24h: number;
  } | null>(null);
  const getGlobalData = useAction(api.crypto.getGlobalData);

  useEffect(() => {
    async function fetchGlobal() {
      try {
        const json = await getGlobalData();
        const d = json.data;
        if (d) {
          setData({
            total_market_cap: d.total_market_cap.usd,
            total_volume: d.total_volume.usd,
            btc_dominance: Math.round(d.market_cap_percentage.btc * 10) / 10,
            eth_dominance: Math.round(d.market_cap_percentage.eth * 10) / 10,
            active_cryptocurrencies: d.active_cryptocurrencies,
            market_cap_change_percentage_24h:
              Math.round(d.market_cap_change_percentage_24h_usd * 100) / 100,
          });
        }
      } catch {
        // Silent fail
      }
    }
    fetchGlobal();
  }, [getGlobalData]);

  return data;
}
