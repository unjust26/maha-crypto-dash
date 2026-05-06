import { action } from "./_generated/server";
import { v } from "convex/values";

const COINS = "bitcoin,ethereum,dogecoin,solana,ripple,cardano,polkadot,avalanche-2";

export const getPrices = action({
  args: {},
  returns: v.any(),
  handler: async () => {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${COINS}&order=market_cap_desc&sparkline=true&price_change_percentage=7d`
    );
    if (!res.ok) {
      console.error("CoinGecko prices API error:", res.status);
      return [];
    }
    return await res.json();
  },
});

export const getChart = action({
  args: {
    coinId: v.string(),
    days: v.number(),
  },
  returns: v.any(),
  handler: async (_ctx, { coinId, days }) => {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
    );
    if (!res.ok) {
      console.error("CoinGecko chart API error:", res.status);
      return { prices: [] };
    }
    return await res.json();
  },
});

export const getFearGreed = action({
  args: {},
  returns: v.any(),
  handler: async () => {
    const res = await fetch("https://api.alternative.me/fng/?limit=30");
    if (!res.ok) {
      console.error("Fear & Greed API error:", res.status);
      return { data: [] };
    }
    return await res.json();
  },
});

export const getGlobalData = action({
  args: {},
  returns: v.any(),
  handler: async () => {
    const res = await fetch("https://api.coingecko.com/api/v3/global");
    if (!res.ok) {
      console.error("CoinGecko global API error:", res.status);
      return { data: null };
    }
    return await res.json();
  },
});
