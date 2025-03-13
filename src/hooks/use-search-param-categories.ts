import { useCallback, useMemo } from "react"
import { useSearchParams } from "react-router"

export const useSearchParamCategories = (
	initialCategories?: string[] | string
) => {
	const [searchParams, setSearchParams] = useSearchParams()

	const validCategories = useMemo(() => {
		const categories =
			searchParams.getAll("categories") || initialCategories
		return Array.isArray(categories) ? categories : [categories]
	}, [searchParams, initialCategories])

	const handleChangeCategories = useCallback(
		(categories: string[] | string) => {
			const params = new URLSearchParams(searchParams)
			params.delete("categories")
			if (Array.isArray(categories)) {
				categories.forEach((category) =>
					params.append("categories", category)
				)
			} else {
				params.append("categories", categories)
			}
			setSearchParams(params)
		},
		[searchParams, setSearchParams]
	)
	return [validCategories, handleChangeCategories] as const
}
