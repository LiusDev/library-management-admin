import { useSearchParamKeyword } from "@/hooks"
import { Group, TextInput } from "@mantine/core"
import { useDebouncedValue } from "@mantine/hooks"
import { IconSearch } from "@tabler/icons-react"
import { useEffect, useState } from "react"

const UserFilter = () => {
	const [keyword, handleChangeKeyword] = useSearchParamKeyword()
	const [value, setValue] = useState(keyword)
	const [debouncedValue] = useDebouncedValue(value, 350)

	useEffect(() => {
		handleChangeKeyword(debouncedValue)
	}, [debouncedValue, handleChangeKeyword])
	return (
		<Group>
			<TextInput
				placeholder="Search by email"
				miw={400}
				leftSection={<IconSearch size={16} />}
				value={value}
				onChange={(event) => setValue(event.currentTarget.value)}
			/>
		</Group>
	)
}

export default UserFilter
