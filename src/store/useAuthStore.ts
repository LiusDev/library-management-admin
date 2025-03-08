import { create } from "zustand"
import { logoutService } from "@/services/auth"
import { UserProfile } from "@/types"

interface AuthState {
	user: UserProfile | null
	isAuthenticated: boolean
	isLoading: boolean
	setUser: (user: UserProfile | null) => void
	setIsAuthenticated: (value: boolean) => void
	setIsLoading: (value: boolean) => void
	logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	isAuthenticated: false,
	isLoading: true,
	setUser: (user) => set({ user }),
	setIsAuthenticated: (value) => set({ isAuthenticated: value }),
	setIsLoading: (value) => set({ isLoading: value }),
	logout: async () => {
		try {
			// Call logout API endpoint to invalidate token on server
			await logoutService()
		} catch (error) {
			console.error("Error during logout:", error)
		} finally {
			// Reset auth state regardless of API success
			set({ user: null, isAuthenticated: false })
		}
	},
}))

export const useAuth = () => useAuthStore((state) => state)
