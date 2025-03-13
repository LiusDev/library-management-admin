import { useSearchParamPagination } from "@/hooks"
import { useCategories } from "@/services/category"
import { SimpleGrid } from "@mantine/core"
import CategoryTable from "./_components/category-table"
import CategoryChart from "./_components/category-chart"

const CategoryPage = () => {
	const [page] = useSearchParamPagination(1)
	const { data, isFetching } = useCategories(page)

	return (
		<SimpleGrid cols={{ base: 1, lg: 2 }} spacing={"xl"}>
			<CategoryTable
				data={data?.data || []}
				isFetching={isFetching}
				page={page}
				total={data?.total || 0}
			/>
			<CategoryChart data={data?.data || []} />
		</SimpleGrid>
	)
}

export default CategoryPage
