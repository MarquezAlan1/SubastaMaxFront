"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, Users } from "lucide-react"
import { LiveBadge } from "./live-badge"

interface VideoPlayerProps {
  videoUrl?: string
  isLive?: boolean
  viewerCount?: number
  className?: string
}

export function VideoPlayer({ videoUrl, isLive = false, viewerCount = 0, className }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState([75])
  const [showControls, setShowControls] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (isLive && videoRef.current) {
      // Auto-play live streams
      videoRef.current.play()
      setIsPlaying(true)
    }
  }, [isLive])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value)
    if (videoRef.current) {
      videoRef.current.volume = value[0] / 100
    }
  }

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        videoRef.current.requestFullscreen()
      }
    }
  }

  const handleMouseMove = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false)
      }
    }, 3000)
  }

  return (
    <Card className={`relative overflow-hidden bg-black ${className}`}>
      <div className="relative aspect-video group" onMouseMove={handleMouseMove}>
        {videoUrl ? (
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            poster="/placeholder.svg?height=400&width=600&text=Video+Placeholder"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          >
            <source src={videoUrl} type="video/mp4" />
            Tu navegador no soporta el elemento de video.
          </video>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <div className="text-center">
              <Play className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {isLive ? "Transmisión en vivo no disponible" : "Video no disponible"}
              </p>
            </div>
          </div>
        )}

        {/* Live Badge */}
        {isLive && (
          <div className="absolute top-4 left-4">
            <LiveBadge />
          </div>
        )}

        {/* Viewer Count */}
        {isLive && viewerCount > 0 && (
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="bg-black/50 text-white">
              <Users className="h-3 w-3 mr-1" />
              {viewerCount.toLocaleString()}
            </Badge>
          </div>
        )}

        {/* Video Controls */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
            showControls || !isPlaying ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={togglePlay} className="text-white hover:bg-white/20">
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>

            <div className="flex items-center gap-2 flex-1">
              <Button variant="ghost" size="sm" onClick={toggleMute} className="text-white hover:bg-white/20">
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <div className="w-20">
                <Slider
                  value={volume}
                  onValueChange={handleVolumeChange}
                  max={100}
                  step={1}
                  className="[&_[role=slider]]:bg-white [&_[role=slider]]:border-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={toggleFullscreen} className="text-white hover:bg-white/20">
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
