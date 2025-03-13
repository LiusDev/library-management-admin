import { redirect } from "react-router"
import { useAuthStore } from "@/store/useAuthStore"
import { fetchUserProfile } from "@/services/auth"

// For non-authenticated pages (login, register)
export const nonAuthLoader = async () => {
	const { isAuthenticated, isLoading } = useAuthStore.getState()

	// Check if we already have authentication state
	if (isAuthenticated && !isLoading) {
		return redirect("/")
	}

	try {
		// Try to fetch the user profile using the access_token in cookies
		const user = await fetchUserProfile()

		// If successful, update auth store
		useAuthStore.setState({
			user,
			isAuthenticated: true,
			isLoading: false,
		})

		// Redirect to home if user is authenticated
		return redirect("/")
	} catch (error) {
		// If no valid token, allow access to non-auth pages
		console.error("Error fetching user profile:", error)
		useAuthStore.setState({
			user: null,
			isAuthenticated: false,
			isLoading: false,
		})
		return null
	}
}

// For authenticated pages (dashboard, profile, etc.)
export const authLoader = async () => {
	const { isAuthenticated, isLoading, logout } = useAuthStore.getState()

	// If we already know user is authenticated, allow access
	if (isAuthenticated && !isLoading) {
		return null
	}

	try {
		// Try to fetch the user profile using the access_token in cookies
		const user = await fetchUserProfile()

		if (user && !["admin", "staff"].includes(user.role)) {
			// If user is not admin or staff, redirect to home
			console.error("User is not admin or staff:", user)
			await logout()
			useAuthStore.setState({
				user: null,
				isAuthenticated: false,
				isLoading: false,
			})
			return redirect("/login?error=unauthorized")
		}

		// If successful, update auth store and allow access
		useAuthStore.setState({
			user,
			isAuthenticated: true,
			isLoading: false,
		})
		return null
	} catch (error) {
		// If auth failed, update store and redirect to login
		console.error("Error fetching user profile:", error)
		useAuthStore.setState({
			user: null,
			isAuthenticated: false,
			isLoading: false,
		})
		return redirect("/login")
	}
}
