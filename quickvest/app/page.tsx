"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingUp, Shield, PieChart } from "lucide-react"

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 page-transition">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 cursor-pointer" aria-label="Go to homepage">
          <TrendingUp className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-foreground">QuickVest</span>
        </a>
        <Button
          variant="outline"
          onClick={() => router.push("/login")}
          className="hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          Login
        </Button>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold text-balance leading-tight">
            Smart Investing Made <span className="text-primary">Simple</span>
          </h1>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto leading-relaxed">
            QuickVest helps beginner investors understand risk tolerance, holding time, and diversification—all in plain
            language. Start building your financial future today.
          </p>
          <Button
            size="lg"
            onClick={() => router.push("/login")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 max-w-5xl mx-auto">
          <div className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-shadow">
            <div className="bg-primary/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <Shield className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-card-foreground">Risk Tolerance</h3>
            <p className="text-muted-foreground leading-relaxed">
              Understand your comfort level with market fluctuations and find investments that match your risk profile.
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-shadow">
            <div className="bg-secondary/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp className="h-7 w-7 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-card-foreground">Holding Time</h3>
            <p className="text-muted-foreground leading-relaxed">
              Learn how long to hold investments to maximize returns and align with your financial goals.
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-shadow">
            <div className="bg-accent/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <PieChart className="h-7 w-7 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-card-foreground">Diversification</h3>
            <p className="text-muted-foreground leading-relaxed">
              Build a balanced portfolio across different assets to reduce risk and optimize growth potential.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
