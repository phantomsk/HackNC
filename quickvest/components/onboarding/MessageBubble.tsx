export default function MessageBubble({ role, content }: { role: string; content: string }) {
  return (
    <div className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}>
      <div className={`rounded-xl px-4 py-2 shadow ${role === "user" ? "bg-primary text-primary-foreground" : "bg-card"}`}>
        <span className="text-sm">{content}</span>
      </div>
    </div>
  )
}
