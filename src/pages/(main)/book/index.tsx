import {
	useSearchParamCategories,
	useSearchParamKeyword,
	useSearchParamPagination,
	useSearchParamsSortOrder,
} from "@/hooks"
import { useBooks } from "@/services/book"
import { SimpleGrid } from "@mantine/core"
import BookTable from "./_components/book-table"

const BookPage = () => {
	const [keyword] = useSearchParamKeyword()
	const [categories] = useSearchParamCategories()
	const [sort, order] = useSearchParamsSortOrder("createdAt", "desc")
	const [page] = useSearchParamPagination(1)
	const { data, isFetching } = useBooks(
		keyword,
		categories,
		sort,
		order,
		page
	)
	return (
		<SimpleGrid cols={{ base: 1, lg: 1 }} spacing={"xl"}>
			<BookTable
				data={data?.data}
				isFetching={isFetching}
				page={page}
				total={data?.total || 0}
			/>
		</SimpleGrid>
	)
}

export default BookPage
