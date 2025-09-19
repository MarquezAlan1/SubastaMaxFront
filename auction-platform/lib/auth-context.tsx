"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export type UserRole = "admin" | "subastador" | "participante"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  tenantId: string
  avatar?: string
  reputation: number
  verified: boolean
  plan: "free" | "pro" | "enterprise"
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (
    email: string,
    password: string,
    name: string,
    role: UserRole,
  ) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  loading: boolean
  updateUser: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Simular carga de usuario desde localStorage
    const savedUser = localStorage.getItem("auction-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)

    // Simulación de autenticación
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock users para demo
    const mockUsers: Record<string, User> = {
      "admin@subastamax.com": {
        id: "1",
        email: "admin@subastamax.com",
        name: "Administrador",
        role: "admin",
        tenantId: "main",
        reputation: 100,
        verified: true,
        plan: "enterprise",
      },
      "subastador@subastamax.com": {
        id: "2",
        email: "subastador@subastamax.com",
        name: "Juan Subastador",
        role: "subastador",
        tenantId: "main",
        reputation: 95,
        verified: true,
        plan: "pro",
      },
      "participante@subastamax.com": {
        id: "3",
        email: "participante@subastamax.com",
        name: "María Participante",
        role: "participante",
        tenantId: "main",
        reputation: 85,
        verified: true,
        plan: "free",
      },
    }

    const mockUser = mockUsers[email]
    if (mockUser && password === "123456") {
      setUser(mockUser)
      localStorage.setItem("auction-user", JSON.stringify(mockUser))
      setLoading(false)
      return { success: true }
    }

    setLoading(false)
    return { success: false, error: "Credenciales inválidas" }
  }

  const register = async (email: string, password: string, name: string, role: UserRole) => {
    setLoading(true)

    // Simulación de registro
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role,
      tenantId: "main",
      reputation: role === "participante" ? 50 : 70,
      verified: false,
      plan: "free",
    }

    setUser(newUser)
    localStorage.setItem("auction-user", JSON.stringify(newUser))
    setLoading(false)
    return { success: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("auction-user")
    router.push("/")
  }

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      localStorage.setItem("auction-user", JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
