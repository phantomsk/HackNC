export default function Progress({ step, total }: { step: number; total: number }) {
  return (
    <div className="w-full flex items-center justify-center py-4">
      <div className="flex gap-2">
        {[...Array(total)].map((_, i) => (
          <div
            key={i}
            className={`h-2 w-8 rounded-full ${i < step ? "bg-primary" : "bg-muted"}`}
          />
        ))}
      </div>
      <span className="ml-4 text-muted-foreground text-xs">Step {step} of {total}</span>
    </div>
  )
}
