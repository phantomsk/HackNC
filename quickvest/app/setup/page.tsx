"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { TrendingUp, Send, Upload, Volume2, Globe } from "lucide-react"
import { cn } from "@/lib/utils"

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
  const [language, setLanguage] = useState<"en" | "es">("en")
  const [parsedData, setParsedData] = useState<Record<string, string> | null>(null)

  // quiz-related state
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState<string | null>(null)
  const [quizStep, setQuizStep] = useState<number>(0) // -1 = pre-ID risk question, 1+ = post-ID quiz
  const [riskScore, setRiskScore] = useState<number | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const ONBOARDING_BASE = "http://127.0.0.1:8000/api/onboarding"

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

    setMessages((prev) => [...prev, userMessage])
    const outgoing = inputValue
    setInputValue("")
    setIsTyping(true)

    try {
      // If we're in "question mode" and the user asks a clarifying question (ends with '?'),
      // send it to the Gemini-backed quiz help endpoint.
      if (currentQuizQuestion && outgoing.trim().endsWith("?")) {
        const res = await fetch(`${ONBOARDING_BASE}/quiz/help`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question_text: currentQuizQuestion,
            user_message: outgoing,
          }),
        })

        if (!res.ok) {
          throw new Error(`Quiz help error: ${res.status}`)
        }

        const data: { answer: string } = await res.json()

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.answer,
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, assistantMessage])
        return
      }

      // Handle the pre-ID risk tolerance question (quizStep === -1)
      if (quizStep === -1 && currentQuizQuestion) {
        const score = parseInt(outgoing, 10)

        if (isNaN(score) || score < 1 || score > 10) {
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: "Please enter a whole number from 1 to 10 so I can understand your risk tolerance.",
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, assistantMessage])
          return
        }

        // Store risk tolerance
        setRiskScore(score)

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            `Great — I'll use a risk score of ${score} when tailoring your portfolio.\n\n` +
            `Next, please upload a photo of your driver's license so I can automatically extract your information.`,
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, assistantMessage])
        // Clear question state; we're now waiting for ID upload
        setCurrentQuizQuestion(null)
        setQuizStep(0)
        return
      }

      let response = ""

      if (!currentQuizQuestion) {
        // Pre-quiz scripted conversation BEFORE risk question & ID
        const userCount = messages.filter((m) => m.role === "user").length + 1

        if (userCount === 1) {
          response = `Nice to meet you, ${outgoing}! Now, what is your main investment goal? (e.g. retirement, a house, education)`
        } else if (userCount === 2) {
          response =
            "Great! Before we scan your ID, how would you rate your risk tolerance on a scale from 1–10? (1 = very conservative, 10 = very aggressive)"
          // Now we expect a risk score, so set the quiz state
          setCurrentQuizQuestion("How would you rate your risk tolerance on a scale from 1–10?")
          setQuizStep(-1)
        } else {
          response = "You can upload your driver's license whenever you're ready, and then we'll move into a quick quiz."
        }
      } else {
        // We are in the POST-ID quiz (quizStep >= 1) treating this as an answer
        if (quizStep === 1) {
          // Move to question 2
          response =
            "Thanks, that helps a lot.\n\nSecond question: What is your investment time horizon?\n" +
            "A) Less than 3 years\nB) 3–7 years\nC) More than 7 years"

          setQuizStep(2)
          setCurrentQuizQuestion(
            "What is your investment time horizon? A) Less than 3 years, B) 3–7 years, C) More than 7 years."
          )
        } else if (quizStep === 2) {
          // Finish quiz
          response =
            "Got it. That’s all I need for now.\n\nBased on your answers, I'll tailor your portfolio. Redirecting you to your dashboard..."
          setQuizStep(3)
          setCurrentQuizQuestion(null)
          setIsSetupComplete(true)
        } else {
          response = "Thanks! I’ve recorded your responses."
        }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      console.error(err)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, something went wrong. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) { 
      return;
    }

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

      const firstQuizQuestion =
        "On a scale from 1 to 10, how comfortable are you with market ups and downs? (1 = very conservative, 10 = very aggressive)"

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          `I've extracted your details and created your account (ID: ${data.account_id}).\n\n` +
          `Here's what I found:\n${summaryLines}\n\n` +
          `Now let's do a quick suitability quiz to better tailor your portfolio.\n\n` +
          `First question: ${firstQuizQuestion}`,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Start post-ID quiz
      setCurrentQuizQuestion(firstQuizQuestion)
      setQuizStep(1)
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLanguage(language === "en" ? "es" : "en")}
            >
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
                  <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
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
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
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
                placeholder={
                  currentQuizQuestion
                    ? "Answer the question or ask for clarification..."
                    : "Type your message..."
                }
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