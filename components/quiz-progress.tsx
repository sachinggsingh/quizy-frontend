"use client"

interface QuizProgressProps {
  current: number
  total: number
  timeRemaining: number
  maxTime: number
}

export function QuizProgress({ current, total, timeRemaining, maxTime }: QuizProgressProps) {
  const progress = (current / total) * 100
  const isTimeRunningOut = timeRemaining < 60
  const isCritical = timeRemaining < 15

  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60

  const circumference = 2 * Math.PI * 54
  const strokeDashoffset = circumference - (timeRemaining / maxTime) * circumference

  // Determine color based on time remaining
  const getTimerColor = () => {
    if (isCritical) return "from-red-500 to-red-600"
    if (isTimeRunningOut) return "from-orange-500 to-orange-600"
    return "from-[#90AB8B] to-[#84934A]"
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full">
      {/* Question Progress Section */}
      <div className="w-full space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-foreground">
            Q{current}/{total}
          </span>
          <span className="text-xs font-medium text-muted-foreground">{Math.round(progress)}%</span>
        </div>
        {/* Progress Bar */}
        <div className="relative h-1.5 rounded-full overflow-hidden bg-muted/50 w-full">
          <div
            className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${getTimerColor()}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Large Circular Timer */}
      <div className="relative w-32 h-32">
        {/* Outer glow effect */}
        <div
          className={`absolute inset-0 rounded-full blur-xl opacity-40 bg-gradient-to-r ${getTimerColor()} animate-pulse`}
        />

        {/* Background circle */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20" />

        {/* SVG Circle Progress */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 120 120" fill="none">
          {/* Background circle */}
          <circle cx="60" cy="60" r="54" stroke="currentColor" strokeWidth="2" className="text-muted/30" />
          {/* Animated progress circle */}
          <defs>
            <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isCritical ? "#ef4444" : isTimeRunningOut ? "#f97316" : "#6DC3BB"} />
              <stop offset="100%" stopColor={isCritical ? "#dc2626" : isTimeRunningOut ? "#ea580c" : "#549992"} />
            </linearGradient>
          </defs>
          <circle
            cx="60"
            cy="60"
            r="54"
            stroke="url(#timerGradient)"
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <div className="text-center">
            <div
              className={`text-4xl font-black tracking-tight transition-all duration-300 ${
                isCritical ? "text-red-500 drop-shadow-lg" : isTimeRunningOut ? "text-orange-500" : "text-primary"
              }`}
            >
              {minutes}:{seconds.toString().padStart(2, "0")}
            </div>
            <p className="text-xs font-semibold text-muted-foreground mt-1 uppercase tracking-wider">
              {isCritical ? "Hurry!" : "Left"}
            </p>
          </div>
        </div>

        {isCritical && (
          <style jsx>{`
            @keyframes criticalpulse {
              0%,
              100% {
                opacity: 1;
              }
              50% {
                opacity: 0.6;
              }
            }
            .animate-critical-pulse {
              animation: criticalpulse 0.6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            }
          `}</style>
        )}
      </div>
    </div>
  )
}
