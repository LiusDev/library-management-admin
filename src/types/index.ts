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

export interface Book {
	_id: string
	title: string
	description: string
	author: string
	publishedDate: string
	quantity: number
	cover: string
	category: Category[]
	createdAt: string
	updatedAt: string
}
