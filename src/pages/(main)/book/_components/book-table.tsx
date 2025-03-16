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
import { useSearchParamPagination, useSearchParamsSortOrder } from "@/hooks"
import { LIST_LIMIT } from "@/utils/constant"
import BookFilter from "./book-filter"
import { Link, useNavigate } from "react-router"
import { deleteBook } from "@/services/book"
import { notifications } from "@mantine/notifications"
import { useQueryClient } from "@tanstack/react-query"
import { closeAllModals, openConfirmModal } from "@mantine/modals"
interface BookTableProps {
	data: Book[]
	isFetching: boolean
	page: number
	total: number
}

const RenderActions: DataTableColumn<Book>["render"] = (record) => {
	const navigate = useNavigate()
	const queryClient = useQueryClient()
	const handleDelete = async () => {
		try {
			await deleteBook(record._id)
			notifications.show({
				color: "green",
				title: "Book deleted",
				message: "The book has been deleted successfully",
			})
			navigate("/book")
			queryClient.invalidateQueries({
				queryKey: ["books"],
			})
			queryClient.invalidateQueries({
				queryKey: ["book", record._id],
			})
			navigate("/book")
		} catch (error) {
			console.error("Failed to delete book:", error)
			notifications.show({
				color: "red",
				title: "Failed to delete book",
				message: "An error occurred while deleting the book",
			})
		}
	}

	const handleOpenDeleteModal = () => {
		openConfirmModal({
			title: "Delete book",
			children: (
				<Text size="sm">
					Are you sure you want to delete this book? This action
					cannot be undone.
				</Text>
			),
			labels: { confirm: "Delete book", cancel: "Cancel" },
			confirmProps: { color: "red" },
			onCancel: closeAllModals,
			onConfirm: handleDelete,
		})
	}
	return (
		<Group gap={4} justify="center" wrap="nowrap">
			<ActionIcon
				size={"sm"}
				variant="transparent"
				onClick={(e) => {
					e.stopPropagation() // 👈 prevent triggering the row click function
					navigate(`/book/${record._id}`)
				}}
			>
				<IconEye />
			</ActionIcon>
			<ActionIcon
				size={"sm"}
				variant="transparent"
				onClick={(e) => {
					e.stopPropagation() // 👈 prevent triggering the row click function
					navigate(`/book/${record._id}?edit=true`)
				}}
			>
				<IconEdit />
			</ActionIcon>
			<ActionIcon
				size={"sm"}
				variant="transparent"
				color="red"
				onClick={(e) => {
					e.stopPropagation() // 👈 prevent triggering the row click function
					handleOpenDeleteModal()
				}}
			>
				<IconTrash size={18} />
			</ActionIcon>
		</Group>
	)
}

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
		render: RenderActions,
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
					component={Link}
					leftSection={<IconPlus size={16} />}
					to={"/book/add"}
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
