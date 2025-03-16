import { useSearchParamKeyword, useSearchParamStatus } from "@/hooks"
import { Button, Group, Popover, Select, TextInput } from "@mantine/core"
import { useDebouncedValue } from "@mantine/hooks"
import { IconFilter, IconSearch } from "@tabler/icons-react"
import { useEffect, useState } from "react"

const status = [
	{
		label: "Checking",
		value: "checking",
	},
	{
		label: "Borrowed",
		value: "borrowed",
	},
	{
		label: "Returned",
		value: "returned",
	},
	{
		label: "Overdue",
		value: "overdue",
	},
]

const CategoryFilter = () => {
	const [selectedStatus, handleChange] = useSearchParamStatus()
	return (
		<Select
			data={status}
			label="Status"
			placeholder="Select status"
			value={selectedStatus}
			onChange={(value) => handleChange(value || "")}
			searchable
			clearable
			comboboxProps={{ withinPortal: false }}
		/>
	)
}

const TransactionFilter = () => {
	const [keyword, handleChangeKeyword] = useSearchParamKeyword()
	const [value, setValue] = useState(keyword)
	const [debouncedValue] = useDebouncedValue(value, 350)

	useEffect(() => {
		handleChangeKeyword(debouncedValue)
	}, [debouncedValue, handleChangeKeyword])
	return (
		<Group>
			<TextInput
				placeholder="Search by ID, email or book title"
				miw={400}
				leftSection={<IconSearch size={16} />}
				value={value}
				onChange={(event) => setValue(event.currentTarget.value)}
			/>
			<Popover shadow="md" width={400} withArrow>
				<Popover.Target>
					<Button px={10} leftSection={<IconFilter size={16} />}>
						Filter
					</Button>
				</Popover.Target>

				<Popover.Dropdown>
					<CategoryFilter />
				</Popover.Dropdown>
			</Popover>
		</Group>
	)
}

export default TransactionFilter
