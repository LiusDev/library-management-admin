export interface UserProfile {
	_id: string
	username: string
	email: string
	role: "user" | "staff" | "admin"
	avatar: string
	createdAt: string
	updatedAt: string
}
