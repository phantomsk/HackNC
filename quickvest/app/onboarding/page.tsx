import ChatWindow from "@/components/onboarding/ChatWindow"
import Progress from "@/components/onboarding/Progress"

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      <Progress step={1} total={5} />
      <ChatWindow />
    </div>
  )
}
