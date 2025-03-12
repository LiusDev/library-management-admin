import { deleteCategory } from "@/services/category"
import { Category } from "@/types"
import { Button, Group, Text } from "@mantine/core"
import { useForm } from "@mantine/form"
import { closeAllModals } from "@mantine/modals"
import { notifications } from "@mantine/notifications"
import { useQueryClient } from "@tanstack/react-query"

export const DeleteCategoryConfirmModal = ({
	record,
}: {
	record: Category
}) => {
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
