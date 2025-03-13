import { Book } from "@/types"
import {
	ActionIcon,
	Badge,
	Button,
	Group,
	Stack,
	Text,
	Title,
} from "@mantine/core"
// import { openModal } from "@mantine/modals"
import { IconEdit, IconEye, IconPlus, IconTrash } from "@tabler/icons-react"
import { DataTable, DataTableColumn, DataTableProps } from "mantine-datatable"
import dayjs from "dayjs"
import {
	openDrawer,
	useSearchParamPagination,
	useSearchParamsSortOrder,
} from "@/hooks"
import { LIST_LIMIT } from "@/utils/constant"
import BookFilter from "./book-filter"

interface BookTableProps {
	data: Book[]
	isFetching: boolean
	page: number
	total: number
}

const renderActions: DataTableColumn<Book>["render"] = (record) => (
	<Group gap={4} justify="right" wrap="nowrap">
		<ActionIcon
			variant="transparent"
			onClick={(e) => {
				e.stopPropagation() // 👈 prevent triggering the row click function
				openDrawer({
					title: `View book`,
					children: <div>Book details</div>,
				})
			}}
		>
			<IconEye />
		</ActionIcon>
		<ActionIcon
			data-keep={record._id}
			variant="transparent"
			color="green"
			onClick={(e) => {
				e.stopPropagation() // 👈 prevent triggering the row click function
			}}
		>
			<IconEdit size={18} />
		</ActionIcon>
		<ActionIcon
			variant="transparent"
			color="red"
			onClick={(e) => {
				e.stopPropagation() // 👈 prevent triggering the row click function
				// openModal({
				// 	title: `Delete book ${record.title}`,
				// 	children: <DeleteCategoryConfirmModal record={record} />,
				// })
			}}
		>
			<IconTrash size={18} />
		</ActionIcon>
	</Group>
)

const columns: DataTableProps<Book>["columns"] = [
	{
		accessor: "createdAt",
		title: "Created At",
		render: (record) =>
			dayjs(record.createdAt).format("DD/MM/YYYY - HH:mm"),
		sortable: true,
	},
	{
		accessor: "cover",
		title: "Cover",
		render: (record) => (
			<img
				src={record.cover}
				alt={record.title}
				className="object-cover object-center w-16 rounded aspect-9/16"
			/>
		),
	},
	{
		accessor: "title",
		title: "Title",
		render: (record) => <Text fw={500}>{record.title}</Text>,
		sortable: true,
	},
	{
		accessor: "author",
		title: "Author",
		sortable: true,
	},
	{
		accessor: "category",
		title: "Categories",
		render: (record) => (
			<Group gap={"xs"}>
				{record.category.map((category) => (
					<Badge key={category._id} color="blue">
						{category.name}
					</Badge>
				))}
			</Group>
		),
	},
	{
		accessor: "quantity",
		title: "Quantity",
		sortable: true,
	},
	{
		accessor: "actions",
		render: renderActions,
	},
]
const BookTable = ({ data, isFetching, page, total }: BookTableProps) => {
	const [sort, order, handleChangeSortOrder] = useSearchParamsSortOrder()
	const [, handleChangePage] = useSearchParamPagination(1)
	return (
		<Stack>
			<Group justify="space-between">
				<Title order={2}>Manage books</Title>
				<BookFilter />
				<Button
					// onClick={() => {}}
					leftSection={<IconPlus size={16} />}
				>
					Add new book
				</Button>
			</Group>
			<DataTable
				withTableBorder
				striped
				highlightOnHover
				pinLastColumn
				columns={columns}
				fetching={isFetching}
				records={data}
				page={page}
				onPageChange={handleChangePage}
				totalRecords={total}
				recordsPerPage={LIST_LIMIT}
				sortStatus={{
					columnAccessor: sort,
					direction: order,
				}}
				onSortStatusChange={({ columnAccessor, direction }) =>
					handleChangeSortOrder(columnAccessor, direction)
				}
				idAccessor="_id"
			/>
		</Stack>
	)
}

export default BookTable
