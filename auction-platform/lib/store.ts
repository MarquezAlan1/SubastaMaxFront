import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Auction {
  id: string
  title: string
  description: string
  category: string
  status: "upcoming" | "live" | "ended"
  startTime: Date
  endTime: Date
  currentBid: number
  startingBid: number
  increment: number
  bidCount: number
  participants: number
  auctioneerId: string
  auctioneerName: string
  imageUrl: string
  videoUrl?: string
  autoExtend: boolean
  tenantId: string
  featured: boolean
}

export interface Bid {
  id: string
  auctionId: string
  userId: string
  userName: string
  amount: number
  timestamp: Date
  status: "pending" | "accepted" | "rejected"
}

interface AuctionStore {
  auctions: Auction[]
  currentAuction: Auction | null
  bids: Bid[]
  connectedUsers: number

  // Actions
  setAuctions: (auctions: Auction[]) => void
  setCurrentAuction: (auction: Auction | null) => void
  addBid: (bid: Bid) => void
  updateAuction: (id: string, updates: Partial<Auction>) => void
  setConnectedUsers: (count: number) => void
}

export const useAuctionStore = create<AuctionStore>()(
  persist(
    (set, get) => ({
      auctions: [],
      currentAuction: null,
      bids: [],
      connectedUsers: 0,

      setAuctions: (auctions) => set({ auctions }),

      setCurrentAuction: (auction) => set({ currentAuction: auction }),

      addBid: (bid) =>
        set((state) => ({
          bids: [bid, ...state.bids.slice(0, 99)], // Keep last 100 bids
        })),

      updateAuction: (id, updates) =>
        set((state) => ({
          auctions: state.auctions.map((auction) => (auction.id === id ? { ...auction, ...updates } : auction)),
          currentAuction:
            state.currentAuction?.id === id ? { ...state.currentAuction, ...updates } : state.currentAuction,
        })),

      setConnectedUsers: (count) => set({ connectedUsers: count }),
    }),
    {
      name: "auction-store",
      partialize: (state) => ({
        auctions: state.auctions,
        currentAuction: state.currentAuction,
      }),
    },
  ),
)
