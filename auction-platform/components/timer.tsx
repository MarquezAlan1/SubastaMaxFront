"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Clock, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface TimerProps {
  endTime: Date
  onTimeUp?: () => void
  className?: string
  size?: "sm" | "md" | "lg"
}

export function Timer({ endTime, onTimeUp, className, size = "md" }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
    total: number
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const end = new Date(endTime).getTime()
      const difference = end - now

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft({ days, hours, minutes, seconds, total: difference })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 })
        onTimeUp?.()
      }
    }

    calculateTimeLeft()
    const interval = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(interval)
  }, [endTime, onTimeUp])

  const formatTime = (value: number) => value.toString().padStart(2, "0")

  const isUrgent = timeLeft.total <= 300000 // 5 minutes
  const isCritical = timeLeft.total <= 60000 // 1 minute

  if (timeLeft.total <= 0) {
    return (
      <Badge variant="destructive" className={cn("font-mono", className)}>
        <AlertTriangle className="h-3 w-3 mr-1" />
        FINALIZADA
      </Badge>
    )
  }

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1",
    lg: "text-lg px-4 py-2",
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Clock className={cn("h-4 w-4", { "text-destructive": isUrgent })} />
      <div className="flex items-center gap-1">
        {timeLeft.days > 0 && (
          <>
            <Badge
              variant={isCritical ? "destructive" : isUrgent ? "secondary" : "outline"}
              className={cn("font-mono", sizeClasses[size])}
            >
              {formatTime(timeLeft.days)}d
            </Badge>
          </>
        )}
        {(timeLeft.days > 0 || timeLeft.hours > 0) && (
          <Badge
            variant={isCritical ? "destructive" : isUrgent ? "secondary" : "outline"}
            className={cn("font-mono", sizeClasses[size])}
          >
            {formatTime(timeLeft.hours)}h
          </Badge>
        )}
        <Badge
          variant={isCritical ? "destructive" : isUrgent ? "secondary" : "outline"}
          className={cn("font-mono", sizeClasses[size])}
        >
          {formatTime(timeLeft.minutes)}m
        </Badge>
        <Badge
          variant={isCritical ? "destructive" : isUrgent ? "secondary" : "outline"}
          className={cn("font-mono animate-pulse", sizeClasses[size])}
        >
          {formatTime(timeLeft.seconds)}s
        </Badge>
      </div>
    </div>
  )
}
