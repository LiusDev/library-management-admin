import { useSearchParamKeyword, useSearchParamPagination } from "@/hooks"
import { useUsers } from "@/services/user"
import { SimpleGrid } from "@mantine/core"
import UserTable from "./_components/user-table"

const UserPage = () => {
	const [keyword] = useSearchParamKeyword()
	const [page] = useSearchParamPagination(1)
	const { data, isFetching } = useUsers(keyword, page)
	return (
		<SimpleGrid cols={{ base: 1, lg: 1 }} spacing={"xl"}>
			<UserTable
				data={data?.data}
				isFetching={isFetching}
				page={page}
				total={data?.total || 0}
			/>
		</SimpleGrid>
	)
}

export default UserPage
