import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface LiveBadgeProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function LiveBadge({ className, size = "md" }: LiveBadgeProps) {
  return (
    <Badge
      variant="destructive"
      className={cn(
        "animate-pulse font-semibold",
        {
          "text-xs px-2 py-0.5": size === "sm",
          "text-sm px-3 py-1": size === "md",
          "text-base px-4 py-1.5": size === "lg",
        },
        className,
      )}
    >
      <div className="w-2 h-2 bg-current rounded-full mr-1.5 animate-pulse" />
      EN VIVO
    </Badge>
  )
}
