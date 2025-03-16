import { BorrowStatus, BorrowTransaction } from "@/types"
import {
	ActionIcon,
	Badge,
	Grid,
	Group,
	Stack,
	Text,
	Select,
	Button,
	Title,
} from "@mantine/core"
import { closeAllModals, openModal } from "@mantine/modals"
import { notifications } from "@mantine/notifications"
import { IconEdit, IconReload } from "@tabler/icons-react"
import { useQueryClient } from "@tanstack/react-query"
import { DataTable, DataTableColumn, DataTableProps } from "mantine-datatable"
import dayjs from "dayjs"
import { useSearchParamPagination } from "@/hooks"
import { LIST_LIMIT } from "@/utils/constant"
import { useForm } from "@mantine/form"
import { updateTransaction } from "@/services/borrowTransaction"
import { useState } from "react"
import TransactionFilter from "./transaction-filter"

interface TransactionTableProps {
	data: BorrowTransaction[]
	isFetching: boolean
	page: number
	total: number
}

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
]

const UpdateTransactionModal = ({ record }: { record: BorrowTransaction }) => {
	const [loading, setLoading] = useState(false)
	const queryClient = useQueryClient()
	const form = useForm({
		initialValues: {
			status: record.status,
		},
	})

	const handleSubmit = async (values: typeof form.values) => {
		setLoading(true)
		try {
			let payload: Partial<{
				status: BorrowStatus
				dueDate: string
				returnDate: string | undefined
			}> = {
				status: values.status,
			}
			if (values.status === "returned") {
				payload = {
					...payload,
					returnDate: new Date().toISOString(),
				}
			} else {
				payload = {
					...payload,
					returnDate: undefined,
				}
			}
			await updateTransaction(record._id, payload)
			await queryClient.invalidateQueries({
				queryKey: ["transactions"],
			})
			notifications.show({
				title: "Success",
				message: "Transaction updated",
				color: "green",
			})
			closeAllModals()
		} catch (error) {
			console.error(error)
			notifications.show({
				title: "Error",
				message: "Failed to update transaction",
				color: "red",
			})
		} finally {
			setLoading(false)
		}
	}
	return (
		<form onSubmit={form.onSubmit(handleSubmit)}>
			<Stack>
				<Grid columns={4} gutter={"md"}>
					<Grid.Col span={1}>
						<Text>Transaction ID</Text>
					</Grid.Col>
					<Grid.Col span={3}>
						<Text>{record._id}</Text>
					</Grid.Col>
					<Grid.Col span={1}>
						<Text>User</Text>
					</Grid.Col>
					<Grid.Col span={3}>
						<Text>{record.user.email}</Text>
					</Grid.Col>
					<Grid.Col span={1}>
						<Text>Book</Text>
					</Grid.Col>
					<Grid.Col span={3}>
						<Text>{record.book.title}</Text>
					</Grid.Col>
					<Grid.Col span={1}>
						<Text>Status</Text>
					</Grid.Col>
					<Grid.Col span={3}>
						<Select
							data={status}
							value={record.status}
							key={form.key("status")}
							{...form.getInputProps("status")}
						/>
					</Grid.Col>
				</Grid>
				<Group justify="end">
					<Button
						variant="outline"
						color="gray"
						onClick={() => closeAllModals()}
					>
						Cancel
					</Button>
					<Button loading={loading} color="green" type="submit">
						Update
					</Button>
				</Group>
			</Stack>
		</form>
	)
}

const RenderActions: DataTableColumn<BorrowTransaction>["render"] = (
	record
) => {
	const handleOpenEditModal = () => {
		openModal({
			title: "Update transaction",
			size: "xl",
			children: <UpdateTransactionModal record={record} />,
		})
	}
	return (
		<Group gap={4} justify="center" wrap="nowrap">
			<ActionIcon
				size="sm"
				variant="transparent"
				onClick={(e) => {
					e.stopPropagation() // 👈 prevent triggering the row click function
					handleOpenEditModal()
				}}
			>
				<IconEdit />
			</ActionIcon>
		</Group>
	)
}

const formatDate = (date: string) => {
	return dayjs(date).format("DD/MM/YYYY")
}

const getStatus = (record: BorrowTransaction) => {
	if (record.status === BorrowStatus.RETURNED) {
		return {
			label: "Returned",
			color: "green",
		}
	}
	const now = new Date()
	if (new Date(record.dueDate) < now) {
		return {
			label: "Overdue",
			color: "red",
		}
	}
	if (record.status === BorrowStatus.BORROWED) {
		return {
			label: "Borrowed",
			color: "blue",
		}
	}
	return {
		label: "Checking",
		color: "yellow",
	}
}

const columns: DataTableProps<BorrowTransaction>["columns"] = [
	{
		accessor: "_id",
		title: "Transaction ID",
		render: (record) => {
			return (
				<div className="font-medium">
					{record._id.substring(0, 8)}...
				</div>
			)
		},
	},
	{
		accessor: "user",
		title: "User",
		render: (record) => {
			return (
				<div className="flex gap-2 items-center">
					<img
						src={record.user.avatar}
						alt="avatar"
						className="w-8 h-8 rounded-full"
					/>
					<span className="text-muted-foreground">
						{record.user.email}
					</span>
				</div>
			)
		},
	},
	{
		accessor: "book",
		title: "Book",
		render: (record) => {
			return (
				<div className="flex flex-col">
					<span className="font-medium">{record.book.title}</span>
					<span className="text-xs text-muted-foreground">
						by {record.book.author}
					</span>
				</div>
			)
		},
	},
	{
		accessor: "status",
		title: "Status",
		render: (record) => {
			const status = getStatus(record)
			return <Badge color={status.color}>{status.label}</Badge>
		},
	},
	{
		accessor: "borrowDate",
		title: "Borrow Date",
		render: (record) => formatDate(record.borrowDate),
	},
	{
		accessor: "dueDate",
		title: "Due Date",
		render: (record) => formatDate(record.dueDate),
	},
	{
		accessor: "returnDate",
		title: "Return Date",
		render: (record) =>
			record.returnDate ? formatDate(record.returnDate) : "-",
	},
	{
		accessor: "actions",
		render: RenderActions,
	},
]

const TransactionTable = ({
	data,
	isFetching,
	page,
	total,
}: TransactionTableProps) => {
	const [, handleChangePage] = useSearchParamPagination()

	return (
		<Stack>
			<Group justify="space-between">
				<Title order={2}>Manage borrow transactions</Title>
				<TransactionFilter />
				<Button leftSection={<IconReload size={16} />}>Refresh</Button>
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
				idAccessor="_id"
			/>
		</Stack>
	)
}

export default TransactionTable
