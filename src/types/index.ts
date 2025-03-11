export interface UserProfile {
	_id: string
	username: string
	email: string
	role: "user" | "staff" | "admin"
	avatar: string
	createdAt: string
	updatedAt: string
}

export interface ListData<T> {
	data: T[]
	total: number
	page: number
	limit: number
}

export interface Category {
	_id: string
	name: string
	description: string
}
