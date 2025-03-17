import { useSearchParamPagination } from "@/hooks"
import { updateUser } from "@/services/user"
import { UserProfile } from "@/types"
import { LIST_LIMIT } from "@/utils/constant"
import {
	ActionIcon,
	Badge,
	Button,
	Grid,
	Group,
	Select,
	Stack,
	Text,
	Title,
} from "@mantine/core"
import { useForm } from "@mantine/form"
import { closeAllModals, openModal } from "@mantine/modals"
import { notifications } from "@mantine/notifications"
import { IconEdit, IconReload } from "@tabler/icons-react"
import { useQueryClient } from "@tanstack/react-query"
import { DataTable, DataTableColumn, DataTableProps } from "mantine-datatable"
import { useEffect, useState } from "react"
import UserFilter from "./user-filter"

interface UserTableProps {
	data: UserProfile[]
	isFetching: boolean
	page: number
	total: number
}

const userStatus = [
	{
		label: "Active",
		value: "active",
	},
	{
		label: "Banned",
		value: "banned",
	},
]

const UpdateUserModal = ({ record }: { record: UserProfile }) => {
	const [loading, setLoading] = useState(false)
	const queryClient = useQueryClient()
	const form = useForm({
		initialValues: {
			role: record.role,
			status: record.status,
		},
	})

	useEffect(() => {
		form.setValues({
			role: record.role,
			status: record.status,
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [record])

	const handleSubmit = async (values: typeof form.values) => {
		setLoading(true)
		try {
			await updateUser(record._id, values)
			queryClient.invalidateQueries({
				queryKey: ["users"],
			})
			notifications.show({
				title: "User updated",
				message: "User has been updated",
				color: "green",
			})
			closeAllModals()
		} catch (error) {
			console.error(error)
			notifications.show({
				title: "Error",
				message: "Failed to update user",
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
						<Text>Email</Text>
					</Grid.Col>
					<Grid.Col span={3}>
						<Text>{record.email}</Text>
					</Grid.Col>
					<Grid.Col span={1}>
						<Text>Email</Text>
					</Grid.Col>
					<Grid.Col span={3}>
						<Text>{record.phone}</Text>
					</Grid.Col>
					<Grid.Col span={1}>
						<Text>Role</Text>
					</Grid.Col>
					<Grid.Col span={3}>
						<Select
							data={[
								{
									label: "User",
									value: "user",
								},
								{
									label: "Staff",
									value: "staff",
								},
								{
									label: "Admin",
									value: "admin",
								},
							]}
							key={form.key("role")}
							{...form.getInputProps("role")}
						/>
					</Grid.Col>
					<Grid.Col span={1}>
						<Text>Status</Text>
					</Grid.Col>
					<Grid.Col span={3}>
						<Select
							data={userStatus}
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

const RenderActions: DataTableColumn<UserProfile>["render"] = (record) => {
	const handleOpenEditModal = () => {
		openModal({
			title: "Update user",
			size: "xl",
			children: <UpdateUserModal record={record} />,
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

const getRole = (role: string) => {
	switch (role) {
		case "user":
			return { label: "User", color: "gray" }
		case "staff":
			return { label: "Staff", color: "blue" }
		case "admin":
			return { label: "Admin", color: "red" }
		default:
			return { label: "Unknown", color: "gray" }
	}
}

const getStatus = (status: string) => {
	switch (status) {
		case "active":
			return { label: "Active", color: "green" }
		case "banned":
			return { label: "Banned", color: "red" }
		default:
			return { label: "Unknown", color: "gray" }
	}
}

const columns: DataTableProps<UserProfile>["columns"] = [
	{
		accessor: "avatar",
		title: "",
		render: (record) => {
			return (
				<img
					src={record.avatar}
					alt="avatar"
					className="w-8 h-8 rounded-full"
				/>
			)
		},
	},
	{
		accessor: "email",
		title: "Email",
	},
	{
		accessor: "phone",
		title: "Phone",
	},
	{
		accessor: "role",
		title: "Role",
		render: (record) => {
			const role = getRole(record.role)
			return <Badge color={role.color}>{role.label}</Badge>
		},
	},
	{
		accessor: "status",
		title: "Status",
		render: (record) => {
			const status = getStatus(record.status)
			return <Badge color={status.color}>{status.label}</Badge>
		},
	},
	{
		accessor: "actions",
		render: RenderActions,
	},
]

const UserTable = ({ data, isFetching, page, total }: UserTableProps) => {
	const [, handleChangePage] = useSearchParamPagination()
	return (
		<Stack>
			<Group justify="space-between">
				<Title order={2}>Manage users</Title>
				<UserFilter />
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

export default UserTable
