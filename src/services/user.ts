import { ListData, UserProfile } from "@/types"
import api from "@/utils/api"
import { LIST_LIMIT } from "@/utils/constant"
import { useSuspenseQuery } from "@tanstack/react-query"

const getUsers = async (keyword?: string, page = 1) => {
	const { data } = await api.get<ListData<UserProfile>>("/admin/users", {
		params: {
			keyword,
			page,
			limit: LIST_LIMIT,
		},
	})
	return data
}

export const useUsers = (keyword?: string, page = 1) => {
	return useSuspenseQuery({
		queryKey: ["users", keyword, page],
		queryFn: () => getUsers(keyword, page),
	})
}

export const updateUser = async (
	id: string,
	payload: Partial<{
		role: string
		status: string
	}>
) => {
	const { data } = await api.put(`/admin/users/${id}`, payload)

	return data
}
