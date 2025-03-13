import { createCategory, updateCategory } from "@/services/category"
import { Category } from "@/types"
import { Button, Group, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form"
import { closeAllModals } from "@mantine/modals"
import { notifications } from "@mantine/notifications"
import { useQueryClient } from "@tanstack/react-query"

type CategoryUpsertModalProps =
	| {
			type: "update"
			record: Category
	  }
	| {
			type: "create"
	  }

export const CategoryUpsertModal = (props: CategoryUpsertModalProps) => {
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
