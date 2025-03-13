import { useSearchParamCategories, useSearchParamKeyword } from "@/hooks"
import { useCategories } from "@/services/category"
import {
	Button,
	Group,
	MultiSelect,
	Popover,
	Skeleton,
	TextInput,
} from "@mantine/core"
import { useDebouncedValue } from "@mantine/hooks"
import { IconFilter, IconSearch } from "@tabler/icons-react"
import { Suspense, useEffect, useState } from "react"

const CategoryFilter = () => {
	const { data: categories } = useCategories(1, 100)
	const [selectedCategories, handleChange] = useSearchParamCategories()
	return (
		<MultiSelect
			label="Categories"
			placeholder="Select categories"
			data={categories?.data.map((category) => ({
				value: category._id,
				label: category.name,
			}))}
			value={selectedCategories}
			onChange={handleChange}
			searchable
			clearable
			hidePickedOptions
			nothingFoundMessage="No category found"
			comboboxProps={{ withinPortal: false }}
		/>
	)
}

const BookFilter = () => {
	const [keyword, handleChangeKeyword] = useSearchParamKeyword()
	const [value, setValue] = useState(keyword)
	const [debouncedValue] = useDebouncedValue(value, 350)

	useEffect(() => {
		handleChangeKeyword(debouncedValue)
	}, [debouncedValue, handleChangeKeyword])

	return (
		<Group>
			<TextInput
				placeholder="Search book by title, description, author..."
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
					<Suspense fallback={<Skeleton height={40} />}>
						<CategoryFilter />
					</Suspense>
				</Popover.Dropdown>
			</Popover>
		</Group>
	)
}

export default BookFilter
