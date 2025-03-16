import { BorrowStatus, BorrowTransaction, ListData } from "@/types"
import api from "@/utils/api"
import { useSuspenseQuery } from "@tanstack/react-query"

const getTransactions = async (
	keyword: string,
	status: "checking" | "borrowed" | "returned" | "overdue",
	page: number | null,
	limit: number | null
) => {
	const { data } = await api.get<ListData<BorrowTransaction>>(
		"/admin/borrow",
		{
			params: {
				keyword,
				status,
				page,
				limit,
			},
		}
	)

	return data
}

export const useTransactions = (
	keyword: string,
	status: "checking" | "borrowed" | "returned" | "overdue",
	page: number | null,
	limit: number | null
) => {
	return useSuspenseQuery({
		queryKey: ["transactions", keyword, status, page, limit],
		queryFn: () => getTransactions(keyword, status, page, limit),
	})
}

export const updateTransaction = async (
	id: string,
	body: Partial<{
		status: BorrowStatus
		dueDate: string
		returnDate: string | undefined
	}>
) => {
	const { data } = await api.put(`/admin/borrow/${id}`, body)
	return data
}
