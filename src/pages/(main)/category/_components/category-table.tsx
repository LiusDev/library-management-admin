import { ActionIcon, Button, Group, Stack, Title } from "@mantine/core"
import { openModal } from "@mantine/modals"
import { CategoryUpsertModal } from "./category-upsert-modal"
import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react"
import { DataTable, DataTableColumn, DataTableProps } from "mantine-datatable"
import { Category } from "@/types"
import { DeleteCategoryConfirmModal } from "./delete-category-modal"
import { LIST_LIMIT } from "@/utils/constant"
import { useSearchParamPagination } from "@/hooks"

interface CategoryTableProps {
	data: (Category & { bookCount: number })[]
	isFetching: boolean
	page: number
	total: number
}
const renderActions: DataTableColumn<Category>["render"] = (record) => (
	<Group gap={4} justify="right" wrap="nowrap">
		<ActionIcon
			size="sm"
			variant="transparent"
			color="green"
			onClick={(e) => {
				e.stopPropagation() // 👈 prevent triggering the row click function
				openModal({
					title: `Update category ${record.name}`,
					children: (
						<CategoryUpsertModal type="update" record={record} />
					),
				})
			}}
		>
			<IconEdit size={16} />
		</ActionIcon>
		<ActionIcon
			size="sm"
			variant="transparent"
			color="red"
			onClick={(e) => {
				e.stopPropagation() // 👈 prevent triggering the row click function
				openModal({
					title: `Delete category ${record.name}`,
					children: <DeleteCategoryConfirmModal record={record} />,
				})
			}}
		>
			<IconTrash size={16} />
		</ActionIcon>
	</Group>
)

const columns: DataTableProps<Category>["columns"] = [
	{
		accessor: "name",
	},
	{
		accessor: "description",
	},
	{
		accessor: "bookCount",
		title: "Books",
	},
	{
		accessor: "actions",
		render: renderActions,
	},
]
const CategoryTable = ({
	data,
	isFetching,
	page,
	total,
}: CategoryTableProps) => {
	const [, handleChangePage] = useSearchParamPagination(1)
	return (
		<Stack>
			<Group justify="space-between">
				<Title order={2}>Categories</Title>
				<Button
					onClick={() =>
						openModal({
							title: "Create new category",
							children: <CategoryUpsertModal type="create" />,
						})
					}
					leftSection={<IconPlus size={16} />}
				>
					Create new category
				</Button>
			</Group>
			<DataTable
				withTableBorder
				striped
				highlightOnHover
				columns={columns}
				fetching={isFetching}
				records={data}
				page={page}
				onPageChange={handleChangePage}
				totalRecords={total}
				recordsPerPage={LIST_LIMIT}
			/>
		</Stack>
	)
}

export default CategoryTable
