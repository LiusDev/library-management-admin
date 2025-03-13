import { UserProfile } from "@/types"
import api from "@/utils/api"

// Profile endpoints
export const fetchUserProfile = async () => {
	try {
		const { data } = await api.get<UserProfile>("/auth/profile")
		return data
	} catch (error) {
		console.error("Error fetching user profile:", error)
		throw error
	}
}

// Auth endpoints
export const logoutService = async () => {
	try {
		await api.get("/auth/logout")
	} catch (error) {
		console.error("Error logging out:", error)
	}
}

// Other auth related service functions can be added here
