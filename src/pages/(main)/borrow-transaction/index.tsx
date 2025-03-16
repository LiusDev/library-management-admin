import {
	useSearchParamKeyword,
	useSearchParamPagination,
	useSearchParamStatus,
} from "@/hooks"
import { SimpleGrid } from "@mantine/core"
import TransactionTable from "./_components/transaction-table"
import { useTransactions } from "@/services/borrowTransaction"
import { LIST_LIMIT } from "@/utils/constant"

const BorrowTransctionsPage = () => {
	const [keyword] = useSearchParamKeyword()
	const [page] = useSearchParamPagination(1)
	const [status] = useSearchParamStatus()
	const { data, isFetching } = useTransactions(
		keyword,
		status,
		page,
		LIST_LIMIT
	)
	return (
		<SimpleGrid cols={{ base: 1, lg: 1 }} spacing={"xl"}>
			<TransactionTable
				data={data?.data}
				isFetching={isFetching}
				page={page}
				total={data?.total || 0}
			/>
		</SimpleGrid>
	)
}

export default BorrowTransctionsPage
