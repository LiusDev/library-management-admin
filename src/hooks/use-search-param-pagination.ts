import { useCallback, useMemo } from "react"
import { useSearchParams } from "react-router"

export const useSearchParamPagination = (initialPage: number = 1) => {
	const [searchParams, setSearchParams] = useSearchParams()

	const validPage = useMemo(() => {
		const page = Number(searchParams.get("page")) || initialPage || 1
		return isNaN(page) ? initialPage : page
	}, [searchParams, initialPage])

	const handleChangePage = useCallback(
		(page: number) => {
			const params = new URLSearchParams(searchParams)
			params.set("page", page.toString())
			setSearchParams(params)
		},
		[searchParams, setSearchParams]
	)
	return [validPage, handleChangePage] as const
}
