import { useCallback, useMemo } from "react"
import { useSearchParams } from "react-router"

export const useSearchParamStatus = (initialStatus?: string) => {
	const [searchParams, setSearchParams] = useSearchParams()

	const validStatus = useMemo(() => {
		const status = searchParams.get("status") || initialStatus
		return status as "checking" | "borrowed" | "returned" | "overdue"
	}, [searchParams, initialStatus])

	const handleChangeStatus = useCallback(
		(status: string) => {
			const params = new URLSearchParams(searchParams)
			params.set("status", status)
			setSearchParams(params)
		},
		[searchParams, setSearchParams]
	)
	return [validStatus, handleChangeStatus] as const
}
