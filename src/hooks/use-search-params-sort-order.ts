import { useCallback, useMemo } from "react"
import { useSearchParams } from "react-router"

export const useSearchParamsSortOrder = (
	inititalSort: string = "createdAt",
	initialOrder: "asc" | "desc" = "desc"
) => {
	const [searchParams, setSearchParams] = useSearchParams()

	const validSort = useMemo(() => {
		const sort = searchParams.get("sort") || inititalSort
		return sort
	}, [searchParams, inititalSort])

	const validOrder = useMemo(() => {
		const order = searchParams.get("order") || initialOrder
		return order as "desc" | "asc"
	}, [searchParams, initialOrder])

	const handleChangeSortOrder = useCallback(
		(sort: string, order: "asc" | "desc") => {
			const params = new URLSearchParams(searchParams)
			params.set("sort", sort)
			params.set("order", order)
			setSearchParams(params)
		},
		[searchParams, setSearchParams]
	)
	return [validSort, validOrder, handleChangeSortOrder] as const
}
