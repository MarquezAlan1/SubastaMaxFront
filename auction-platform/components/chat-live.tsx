"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, MessageCircle, Crown, Shield } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface ChatMessage {
  id: string
  userId: string
  userName: string
  message: string
  timestamp: Date
  userRole?: "admin" | "subastador" | "participante"
  isSystemMessage?: boolean
}

interface ChatLiveProps {
  auctionId: string
  className?: string
}

export function ChatLive({ auctionId, className }: ChatLiveProps) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isConnected, setIsConnected] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Simulate WebSocket connection
    setIsConnected(true)

    // Add initial system message
    const welcomeMessage: ChatMessage = {
      id: "welcome",
      userId: "system",
      userName: "Sistema",
      message: "¡Bienvenido al chat de la subasta! Mantén un comportamiento respetuoso.",
      timestamp: new Date(),
      isSystemMessage: true,
    }

    setMessages([welcomeMessage])

    // Simulate incoming messages
    const messageInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        const mockMessages = [
          "¡Excelente pieza!",
          "¿Cuál es la procedencia?",
          "Muy buena puja",
          "¿Hay más información disponible?",
          "Hermosa obra",
          "¿Incluye certificado de autenticidad?",
          "Gran oportunidad",
          "¿Cuáles son las dimensiones?",
        ]

        const mockUsers = [
          { name: "Carlos M.", role: "participante" as const },
          { name: "Ana L.", role: "participante" as const },
          { name: "Roberto S.", role: "participante" as const },
          { name: "María G.", role: "participante" as const },
        ]

        const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)]
        const randomMessage = mockMessages[Math.floor(Math.random() * mockMessages.length)]

        const newMsg: ChatMessage = {
          id: Date.now().toString(),
          userId: `user-${Math.random()}`,
          userName: randomUser.name,
          message: randomMessage,
          timestamp: new Date(),
          userRole: randomUser.role,
        }

        setMessages((prev) => [...prev, newMsg].slice(-50)) // Keep last 50 messages
      }
    }, 5000)

    return () => {
      clearInterval(messageInterval)
      setIsConnected(false)
    }
  }, [auctionId])

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !user) return

    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      message: newMessage.trim(),
      timestamp: new Date(),
      userRole: user.role,
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")
  }

  const getRoleIcon = (role?: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-3 w-3 text-red-500" />
      case "subastador":
        return <Crown className="h-3 w-3 text-yellow-500" />
      default:
        return null
    }
  }

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case "admin":
        return (
          <Badge variant="destructive" className="text-xs">
            Admin
          </Badge>
        )
      case "subastador":
        return (
          <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
            Subastador
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Chat en Vivo
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
            <span className="text-xs text-muted-foreground">{isConnected ? "Conectado" : "Desconectado"}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-80 px-4" ref={scrollAreaRef}>
          <div className="space-y-3 pb-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-3 ${message.isSystemMessage ? "justify-center" : ""}`}>
                {!message.isSystemMessage && (
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={`/placeholder-icon.png?height=32&width=32&text=${message.userName[0]}`} />
                    <AvatarFallback className="text-xs">{message.userName[0]}</AvatarFallback>
                  </Avatar>
                )}
                <div className={`flex-1 ${message.isSystemMessage ? "text-center" : ""}`}>
                  {message.isSystemMessage ? (
                    <div className="bg-muted rounded-lg px-3 py-2 text-sm text-muted-foreground">{message.message}</div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">{message.userName}</span>
                        {getRoleIcon(message.userRole)}
                        {getRoleBadge(message.userRole)}
                        <span className="text-xs text-muted-foreground">
                          {message.timestamp.toLocaleTimeString("es-MX", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-foreground break-words">{message.message}</p>
                    </>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="border-t p-4">
          {user ? (
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Escribe un mensaje..."
                maxLength={200}
                disabled={!isConnected}
              />
              <Button type="submit" size="sm" disabled={!newMessage.trim() || !isConnected}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          ) : (
            <div className="text-center text-sm text-muted-foreground">
              <p>Inicia sesión para participar en el chat</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
