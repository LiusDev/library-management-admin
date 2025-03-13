import axios from "axios"
import { useAuthStore } from "@/store/useAuthStore"

export const API_URL = import.meta.env.PROD
	? "https://library-api.quydx.id.vn"
	: "http://localhost:9999"

// Create axios instance
const api = axios.create({
	baseURL: API_URL,
	withCredentials: true, // Important for cookies to be sent
})

// Add response interceptor
api.interceptors.response.use(
	(response) => response,
	(error) => {
		// Handle 401 Unauthorized responses
		if (error.response && error.response.status === 401) {
			// Logout user when token is invalid/expired
			useAuthStore.getState().logout()
			// Redirect to login page if not already there
			if (window.location.pathname !== "/login") {
				window.location.replace("/login")
			}
		}
		return Promise.reject(error)
	}
)

export default api
