import { Book, ListData } from "@/types"
import api from "@/utils/api"
import { LIST_LIMIT } from "@/utils/constant"
import { FileWithPath } from "@mantine/dropzone"
import { useSuspenseQuery } from "@tanstack/react-query"

const getAllBooks = async ({
	keyword,
	categories,
	sort = "createdAt",
	order = "desc",
	page = 1,
	limit = LIST_LIMIT,
}: {
	keyword?: string
	categories?: string[] | string
	order?: "asc" | "desc"
	sort?: string
	page?: number
	limit?: number
}) => {
	const { data } = await api.get<ListData<Book>>("/admin/books", {
		params: {
			keyword,
			categories,
			order,
			sort,
			page,
			limit,
		},
	})
	return data
}

export const useBooks = (
	keyword?: string,
	categories?: string[] | string,
	sort = "createdAt",
	order = "desc" as "asc" | "desc",
	page: number = 1,
	limit: number = LIST_LIMIT
) => {
	return useSuspenseQuery({
		queryKey: ["books", keyword, categories, order, sort, page, limit],
		queryFn: () =>
			getAllBooks({ keyword, categories, order, sort, page, limit }),
	})
}

const getBookById = async (id: string | undefined) => {
	if (!id) return null
	const { data } = await api.get<Book>(`/admin/books/${id}`)
	return data
}

export const useBook = (id: string | undefined) => {
	return useSuspenseQuery({
		queryKey: ["book", id],
		queryFn: () => getBookById(id),
	})
}

export const addBook = async (
	data: Omit<
		Book,
		"_id" | "createdAt" | "updatedAt" | "cover" | "category"
	> & {
		cover: FileWithPath | null
		category: string[]
	}
) => {
	const { data: book } = await api.postForm<Book>("/admin/books", data)
	return book
}

export const updateBook = async (
	id: string | undefined,
	data: Partial<
		Omit<Book, "cover" | "category"> & {
			cover: FileWithPath | null
			category: string[]
		}
	>
) => {
	if (!id) return null
	if (!data.cover) delete data.cover
	const { data: book } = await api.postForm<Book>(`/admin/books/${id}`, data)
	return book
}

export const deleteBook = async (id: string | undefined) => {
	if (!id) return null
	const { data } = await api.delete(`/admin/books/${id}`)
	return data
}
