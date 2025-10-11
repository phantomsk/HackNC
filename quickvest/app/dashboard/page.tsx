"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, TrendingDown, Search, Moon, Sun, Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface Stock {
  id: string
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  marketCap: string
  isFavorite: boolean
}

export default function DashboardPage() {
  const [darkMode, setDarkMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("marketCap")
  const [stocks, setStocks] = useState<Stock[]>([
    {
      id: "1",
      symbol: "AAPL",
      name: "Apple Inc.",
      price: 178.25,
      change: 2.45,
      changePercent: 1.39,
      marketCap: "$2.8T",
      isFavorite: true,
    },
    {
      id: "2",
      symbol: "MSFT",
      name: "Microsoft Corporation",
      price: 412.8,
      change: -1.2,
      changePercent: -0.29,
      marketCap: "$3.1T",
      isFavorite: false,
    },
    {
      id: "3",
      symbol: "GOOGL",
      name: "Alphabet Inc.",
      price: 142.65,
      change: 3.15,
      changePercent: 2.26,
      marketCap: "$1.8T",
      isFavorite: true,
    },
    {
      id: "4",
      symbol: "AMZN",
      name: "Amazon.com Inc.",
      price: 178.35,
      change: 1.85,
      changePercent: 1.05,
      marketCap: "$1.9T",
      isFavorite: false,
    },
    {
      id: "5",
      symbol: "TSLA",
      name: "Tesla Inc.",
      price: 242.84,
      change: -5.42,
      changePercent: -2.18,
      marketCap: "$770B",
      isFavorite: false,
    },
    {
      id: "6",
      symbol: "NVDA",
      name: "NVIDIA Corporation",
      price: 875.28,
      change: 12.45,
      changePercent: 1.44,
      marketCap: "$2.2T",
      isFavorite: true,
    },
  ])

  const toggleFavorite = (id: string) => {
    setStocks((prev) => prev.map((stock) => (stock.id === id ? { ...stock, isFavorite: !stock.isFavorite } : stock)))
  }

  const handleBuy = (symbol: string) => {
    // Placeholder for buy action - replace with actual API call
    console.log(`Buy ${symbol}`)
  }

  const handleSell = (symbol: string) => {
    // Placeholder for sell action - replace with actual API call
    console.log(`Sell ${symbol}`)
  }

  const filteredStocks = stocks
    .filter(
      (stock) =>
        stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "favorites") {
        return b.isFavorite ? 1 : -1
      }
      return 0
    })

  return (
    <div className={cn("min-h-screen page-transition", darkMode ? "dark" : "", "bg-background")}>
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-7 w-7 text-primary" />
              <span className="text-xl font-bold text-foreground">QuickVest</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden sm:block">Welcome back, Investor!</span>
              <Button variant="outline" size="icon" onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Portfolio Summary */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Portfolio Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">$24,582.50</div>
              <p className="text-sm text-success flex items-center gap-1 mt-1">
                <TrendingUp className="h-4 w-4" />
                +$1,245.30 (5.34%)
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Today's Change</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">+$342.15</div>
              <p className="text-sm text-success flex items-center gap-1 mt-1">
                <TrendingUp className="h-4 w-4" />
                +1.41%
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Invested</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">$20,000.00</div>
              <p className="text-sm text-muted-foreground mt-1">Across 6 stocks</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search stocks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="marketCap">Market Cap</SelectItem>
              <SelectItem value="favorites">Favorites</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stock Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStocks.map((stock) => (
            <Card key={stock.id} className="border-border hover:shadow-lg transition-shadow group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg font-bold text-foreground">{stock.symbol}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{stock.name}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => toggleFavorite(stock.id)} className="h-8 w-8">
                    <Star
                      className={cn(
                        "h-4 w-4",
                        stock.isFavorite ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground",
                      )}
                    />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-2xl font-bold text-foreground">${stock.price.toFixed(2)}</div>
                  <div
                    className={cn(
                      "flex items-center gap-1 text-sm font-medium mt-1",
                      stock.change >= 0 ? "text-success" : "text-destructive",
                    )}
                  >
                    {stock.change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    {stock.change >= 0 ? "+" : ""}
                    {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}
                    %)
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">Market Cap: {stock.marketCap}</div>

                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => handleBuy(stock.symbol)}
                    className="flex-1 bg-success hover:bg-success/90 text-success-foreground"
                  >
                    Buy
                  </Button>
                  <Button onClick={() => handleSell(stock.symbol)} variant="outline" className="flex-1">
                    Sell
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
