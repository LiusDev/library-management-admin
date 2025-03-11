import { useSearchParamPagination } from "@/hooks"
import {
	createCategory,
	deleteCategory,
	updateCategory,
	useCategories,
} from "@/services/category"
import { Category } from "@/types"
import { LIST_LIMIT } from "@/utils/constant"
import {
	SimpleGrid,
	ActionIcon,
	Button,
	Group,
	Text,
	TextInput,
	Stack,
	Title,
} from "@mantine/core"
import { useForm } from "@mantine/form"
import { closeAllModals, openModal } from "@mantine/modals"
import { notifications } from "@mantine/notifications"
import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react"
import { useQueryClient } from "@tanstack/react-query"
import { DataTable, DataTableColumn, DataTableProps } from "mantine-datatable"
import { BarChart } from "@mantine/charts"

type CategoryUpsertModalProps =
	| {
			type: "update"
			record: Category
	  }
	| {
			type: "create"
	  }

const CategoryUpsertModal = (props: CategoryUpsertModalProps) => {
	const queryClient = useQueryClient()

	const form = useForm({
		mode: "uncontrolled",
		initialValues: {
			name: props.type === "create" ? "" : props.record.name,
			description:
				props.type === "create" ? "" : props.record.description,
		},
		validate: {
			name: (value) =>
				value.trim().length > 2 ? null : "Category name is too short",
		},
	})
	const handleUpsertCategory = async (values: typeof form.values) => {
		try {
			if (props.type === "create") {
				await createCategory(values)
			} else {
				await updateCategory(props.record._id, values)
			}
			notifications.show({
				color: "green",
				title: "Success",
				message: `Category ${
					props.type === "create" ? "created" : "updated"
				} successfully`,
			})
			queryClient.invalidateQueries({
				queryKey: ["categories"],
			})
			closeAllModals()
		} catch (error) {
			console.error(error)
			notifications.show({
				color: "red",
				title: "Error",
				message: `Failed to ${
					props.type === "create" ? "create" : "update"
				} category`,
			})
		}
	}
	return (
		<form onSubmit={form.onSubmit(handleUpsertCategory)}>
			<TextInput
				key={form.key("name")}
				placeholder="Fiction, Non-fiction, etc."
				label="Category name"
				withAsterisk
				{...form.getInputProps("name")}
			/>
			<TextInput
				mt="md"
				key={form.key("description")}
				placeholder="Books that are based on real events, etc."
				label="Category description"
				{...form.getInputProps("description")}
			/>
			<Group mt="md" gap="sm" justify="flex-end">
				<Button
					variant="transparent"
					c="dimmed"
					onClick={() => closeAllModals()}
				>
					Cancel
				</Button>
				<Button
					color={props.type === "update" ? "green" : undefined}
					type="submit"
				>
					{props.type === "create" ? "Create" : "Update"}
				</Button>
			</Group>
		</form>
	)
}

const DeleteCategoryConfirmModal = ({ record }: { record: Category }) => {
	const queryClient = useQueryClient()
	const form = useForm({
		mode: "uncontrolled",
		initialValues: {
			categoryId: record._id,
		},
	})

	const handleDeleteCategory = async (values: typeof form.values) => {
		try {
			await deleteCategory(values.categoryId)
			notifications.show({
				color: "green",
				title: "Success",
				message: "Category deleted successfully",
			})
			queryClient.invalidateQueries({
				queryKey: ["categories"],
			})
			closeAllModals()
		} catch (error) {
			console.error(error)
			notifications.show({
				color: "red",
				title: "Error",
				message: "Failed to delete category",
			})
		}
	}
	return (
		<form onSubmit={form.onSubmit(handleDeleteCategory)}>
			<Text size="sm">
				Are you sure you want to delete this category? This action
				cannot be undone.
			</Text>
			<Group mt="md" gap="sm" justify="flex-end">
				<Button
					variant="transparent"
					c="dimmed"
					onClick={() => closeAllModals()}
				>
					Cancel
				</Button>
				<Button color="red" type="submit">
					Delete
				</Button>
			</Group>
		</form>
	)
}

const CategoryPage = () => {
	const [page, handleChangePage] = useSearchParamPagination(1)
	const { data, isFetching } = useCategories(page)

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
							<CategoryUpsertModal
								type="update"
								record={record}
							/>
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
						children: (
							<DeleteCategoryConfirmModal record={record} />
						),
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
	return (
		<SimpleGrid cols={2} spacing={"xl"}>
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
					records={data?.data}
					page={page}
					onPageChange={handleChangePage}
					totalRecords={data?.total || 20}
					recordsPerPage={+LIST_LIMIT}
				/>
			</Stack>
			<Stack>
				<Title order={2}>Top 5 categories per page</Title>
				<BarChart
					mt={"md"}
					h={"100%"}
					data={
						data?.data
							?.sort((a, b) => b.bookCount - a.bookCount)
							?.slice(0, 5) || []
					}
					dataKey="name"
					series={[
						{
							name: "bookCount",
							label: "Books",
							color: "violet.6",
						},
					]}
					tickLine="y"
				/>
			</Stack>
		</SimpleGrid>
	)
}

export default CategoryPage
