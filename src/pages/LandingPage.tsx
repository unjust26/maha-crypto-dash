import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  TrendingUp,
  Shield,
  Zap,
  Activity,
  Globe,
} from "lucide-react";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      
      {/* Gradient orbs */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-[128px] animate-pulse" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-cyan-500/8 rounded-full blur-[128px] animate-pulse [animation-delay:1s]" />

      <div className="relative z-10">
        {/* Nav */}
        <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-green-500 flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">CryptoPulse</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Sign in</Link>
            </Button>
            <Button size="sm" asChild className="bg-green-500 hover:bg-green-600 text-white">
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
        </nav>

        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-green-500">Live Market Data</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-5">
            Your Crypto
            <br />
            <span className="bg-gradient-to-r from-green-400 via-cyan-400 to-green-500 bg-clip-text text-transparent">
              Command Center
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Real-time prices, market intelligence, confluence scoring, and the
            Fear & Greed Index — all in one beautiful dashboard.
          </p>

          <div className="flex items-center justify-center gap-3">
            <Button size="lg" asChild className="bg-green-500 hover:bg-green-600 text-white px-8">
              <Link to="/signup">Launch Dashboard</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: BarChart3,
                title: "Live Price Charts",
                desc: "Interactive charts with 24H, 7D, 30D, 90D, and 1Y timeframes. Real-time data from CoinGecko.",
                color: "text-green-500 bg-green-500/10",
              },
              {
                icon: Shield,
                title: "Fear & Greed Index",
                desc: "Animated gauge showing real-time market sentiment. Know when to buy the fear and sell the greed.",
                color: "text-cyan-500 bg-cyan-500/10",
              },
              {
                icon: Zap,
                title: "MIDAS Confluence",
                desc: "RSI, MACD, EMA200, ATR, ADX & Volume — scored into one clear signal. Powered by Project MIDAS.",
                color: "text-amber-500 bg-amber-500/10",
              },
              {
                icon: Globe,
                title: "Global Market Data",
                desc: "Total market cap, 24h volume, BTC dominance, and active coins at a glance.",
                color: "text-violet-500 bg-violet-500/10",
              },
              {
                icon: TrendingUp,
                title: "7-Day Sparklines",
                desc: "Mini charts for every coin so you can spot trends without leaving the overview.",
                color: "text-rose-500 bg-rose-500/10",
              },
              {
                icon: Activity,
                title: "Dark Mode First",
                desc: "Designed for night owls and traders. Easy on the eyes during those late-night sessions.",
                color: "text-emerald-500 bg-emerald-500/10",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur hover:border-border hover:bg-card/80 transition-all"
              >
                <div
                  className={`w-10 h-10 rounded-lg ${feature.color} flex items-center justify-center mb-4`}
                >
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold mb-1.5">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-8 text-sm text-muted-foreground border-t border-border/50">
          <p>
            Built by{" "}
            <span className="font-medium text-foreground">MahaKarya Digital</span>
            {" "}· Powered by CoinGecko API
          </p>
        </footer>
      </div>
    </div>
  );
}
