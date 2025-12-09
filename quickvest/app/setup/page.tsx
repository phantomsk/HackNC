"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { TrendingUp, Send, Upload, Volume2, Globe } from "lucide-react"
import { cn } from "@/lib/utils"
//import { fromTheme } from "tailwind-merge"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface AccountCreateFromLicense {
  account_id: string
  success: boolean
  extracted_data: Record<string, string>
}

export default function SetupPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hi! I'm your QuickVest assistant. I'll help you set up your investment account. Let's start with your name. What should I call you?",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isSetupComplete, setIsSetupComplete] = useState(false)
  const [language, setLanguage] = useState("en")
  const [parsedData, setParsedData] = useState<Record<string, string> | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const ONBOARDING_BASE = "/api/onboarding"

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Auto-navigate when setup is complete
  useEffect(() => {
    if (isSetupComplete) {
      const timer = setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isSetupComplete, router])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    // Add user message
    setMessages((prev) => [...prev, userMessage])
    const outgoing = inputValue
    setInputValue("")
    setIsTyping(true)

    const messageCount = messages.filter((m) => m.role === "user").length + 1
    let response = ""

    if (messageCount === 1) {
      response = `Nice to meet you, ${outgoing}! Now, let's talk about your investment goals. Are you saving for retirement, a house, or something else?`
    } else if (messageCount === 2) {
      response = `Great! Next, I need to understand your risk tolerance. On a scale of 1-10, how comfortable are you with market fluctuations? (1 = very conservative, 10 = very aggressive)`
    } else if (messageCount === 3) {
      response = `Perfect! For verification purposes, could you please upload a photo of your driver's license? I'll automatically extract your information to open your account.`
    } else {
      response = `Thanks! Once you upload your ID, I'll create your account and take you to your dashboard.`
    }

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: response,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, assistantMessage])
    setIsTyping(false)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (!file) return

  const userMessage: Message = {
    id: Date.now().toString(),
    role: "user",
    content: `[Uploaded file: ${file.name}]`,
    timestamp: new Date(),
  }

  setMessages((prev) => [...prev, userMessage])
  setIsTyping(true)

  try {
    const formData = new FormData()
    formData.append("file", file)

    // Call backend: /api/onboarding/account/create-from-license
    const res = await fetch(`${ONBOARDING_BASE}/account/create-from-license`, {
      method: "POST",
      body: formData,
    })

    if (!res.ok) {
      throw new Error(`Backend error: ${res.status}`)
    }

    const data: AccountCreateFromLicense = await res.json()
    setParsedData(data.extracted_data)

    const summaryLines = Object.entries(data.extracted_data)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n")

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content:
        `I've extracted your details and created your account (ID: ${data.account_id}).\n\n` +
        `Here's what I found:\n${summaryLines}\n\n` +
        `If everything looks good, I'll now take you to your dashboard.`,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, assistantMessage])
    setIsSetupComplete(true)
  } catch (error) {
    console.error(error)
    const errorMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content:
        "Sorry, there was an error processing your document. Please try again or use a clearer photo.",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, errorMessage])
  } finally {
    setIsTyping(false)
  }
}


  const speakMessage = (text: string) => {
    // Text-to-speech functionality
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = language
      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 page-transition">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 cursor-pointer" aria-label="Go to homepage">
            <TrendingUp className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold text-foreground">QuickVest Setup</span>
          </a>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setLanguage(language === "en" ? "es" : "en")}>
              <Globe className="h-4 w-4 mr-2" />
              {language === "en" ? "EN" : "ES"}
            </Button>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex flex-col h-[calc(100vh-180px)]">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn("flex gap-3", message.role === "user" ? "justify-end" : "justify-start")}
              >
                <Card
                  className={cn(
                    "max-w-[80%] p-4",
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-card",
                  )}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  {message.role === "assistant" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 h-7 px-2"
                      onClick={() => speakMessage(message.content)}
                    >
                      <Volume2 className="h-3 w-3 mr-1" />
                      Listen
                    </Button>
                  )}
                </Card>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 justify-start">
                <Card className="bg-card p-4">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    />
                  </div>
                </Card>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-border pt-4">
            <div className="flex gap-2">
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              <Button
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={isSetupComplete}
              >
                <Upload className="h-4 w-4" />
              </Button>
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 h-11"
                disabled={isSetupComplete}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isSetupComplete}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
