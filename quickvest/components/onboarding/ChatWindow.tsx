"use client"
import MessageBubble from "./MessageBubble"
import UploadDropzone from "./UploadDropzone"
import ChoiceCard from "./ChoiceCard"
import Progress from "./Progress"
import { useState } from "react"

export default function ChatWindow() {
  // TODO: Implement step orchestration, API calls, slot filling, etc.
  const [messages, setMessages] = useState<any[]>([])
  return (
    <div className="w-full max-w-2xl mx-auto">
      <Progress step={1} total={5} />
      <div className="space-y-2">
        {messages.map((msg, i) => (
          <MessageBubble key={i} {...msg} />
        ))}
      </div>
      {/* TODO: Add input, upload, choices, etc. */}
      <UploadDropzone />
      <ChoiceCard />
    </div>
  )
}
