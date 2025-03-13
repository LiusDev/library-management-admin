import { Book, ListData } from "@/types"
import api from "@/utils/api"
import { LIST_LIMIT } from "@/utils/constant"
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
