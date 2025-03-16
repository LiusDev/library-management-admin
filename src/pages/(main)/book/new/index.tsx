import PageBreadCrumbs from "@/components/page-breadcrumbs"
import { addBook } from "@/services/book"
import { useCategories } from "@/services/category"
import { MAX_FILE_SIZE } from "@/utils/constant"
import {
	Button,
	Grid,
	Group,
	Image,
	MultiSelect,
	NumberInput,
	Stack,
	Text,
	Textarea,
	TextInput,
	Title,
} from "@mantine/core"
import { DatePickerInput } from "@mantine/dates"
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from "@mantine/dropzone"
import { useForm } from "@mantine/form"
import { notifications } from "@mantine/notifications"
import { IconPhoto, IconPlus, IconUpload, IconX } from "@tabler/icons-react"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useNavigate } from "react-router"

const AddBookPage = () => {
	const { data: categories } = useCategories(1, 100)
	const [loading, setLoading] = useState(false)
	const queryClient = useQueryClient()
	const [imageFile, setImageFile] = useState<FileWithPath | null>(null)
	const form = useForm({
		mode: "controlled",
		initialValues: {
			title: "",
			description: "",
			author: "",
			publishedDate: new Date().toISOString(),
			quantity: 0,
			available: 0,
			category: [] as string[],
		},
		validate: {
			title: (value) => {
				if (value.trim() === "") {
					return "Title is required"
				}
				if (value.trim().length < 3) {
					return "Title must be at least 3 characters long"
				}
				return null
			},
			author: (value) => {
				if (value.trim() === "") {
					return "Author is required"
				}
				return null
			},
			publishedDate: (value) => {
				if (value.trim() === "") {
					return "Published date is required"
				}
				return null
			},
			quantity: (value) => {
				if (typeof value !== "number") {
					return "Invalid number"
				}
				if (value < 0) {
					return "Quantity must be greater than or equal to 0"
				}
				return null
			},
			available: (value, values) => {
				if (typeof value !== "number") {
					return "Invalid number"
				}
				if (value < 0) {
					return "Available quantity must be greater than or equal to 0"
				}
				if (value > values.quantity) {
					return "Available quantity must be less than or equal to total quantity"
				}
				return null
			},
			category: (value) => {
				if (value.length === 0) {
					return "Category is required"
				}
				return null
			},
		},
	})
	const navigate = useNavigate()
	const handleAdd = async (values: typeof form.values) => {
		setLoading(true)
		try {
			await addBook({
				...values,
				cover: imageFile,
			})
			notifications.show({
				color: "green",
				title: "Book updated",
				message: "The book has been updated successfully",
			})
			queryClient.invalidateQueries({
				queryKey: ["books"],
			})
			navigate("/book")
		} catch (error) {
			console.error("Failed to update book:", error)
			notifications.show({
				color: "red",
				title: "Failed to update book",
				message: "An error occurred while updating the book",
			})
		} finally {
			setLoading(false)
		}
	}
	return (
		<form onSubmit={form.onSubmit(handleAdd)}>
			<Stack>
				<PageBreadCrumbs
					items={[
						{
							name: "Book",
							url: "/book",
							disabled: loading,
						},
						{
							name: "Add new",
							url: "/book/add",
							disabled: loading,
						},
					]}
				/>
				<Group justify="space-between">
					<Title order={2}>Add new book</Title>
					<Group>
						<Button
							color="green"
							leftSection={<IconPlus size={16} />}
							type="submit"
							loading={loading}
						>
							Add
						</Button>
					</Group>
				</Group>
				<Grid>
					<Grid.Col span={4}>
						<Stack align="center">
							<Image
								src={
									imageFile
										? URL.createObjectURL(imageFile)
										: null
								}
								alt={form.values.title}
								radius={"md"}
								fit="cover"
								w={"400px"}
								className="aspect-11/16"
							/>
							<Dropzone
								accept={IMAGE_MIME_TYPE}
								onDrop={(files) => setImageFile(files[0])}
								onReject={() => {
									notifications.show({
										color: "red",
										title: "Invalid file",
										message:
											"Please upload an image file and make sure it's less than 5MB",
									})
								}}
								className="border-dashed border-2 p-4 text-center"
								disabled={loading}
								maxSize={MAX_FILE_SIZE}
							>
								<Group justify="center" gap="sm">
									<Dropzone.Accept>
										<IconUpload
											size={20}
											color="var(--mantine-color-blue-6)"
											stroke={1.5}
										/>
									</Dropzone.Accept>
									<Dropzone.Reject>
										<IconX
											size={20}
											color="var(--mantine-color-red-6)"
											stroke={1.5}
										/>
									</Dropzone.Reject>
									<Dropzone.Idle>
										<IconPhoto
											size={20}
											color="var(--mantine-color-dimmed)"
											stroke={1.5}
										/>
									</Dropzone.Idle>
									<Text>Upload new cover image</Text>
								</Group>
							</Dropzone>
						</Stack>
					</Grid.Col>
					<Grid.Col span={8}>
						<Stack>
							<TextInput
								label="Title"
								key={form.key("title")}
								{...form.getInputProps("title")}
								disabled={loading}
							/>
							<TextInput
								label="Author"
								key={form.key("author")}
								{...form.getInputProps("author")}
								disabled={loading}
							/>
							<Textarea
								label="Description"
								autosize
								minRows={4}
								key={form.key("description")}
								{...form.getInputProps("description")}
								disabled={loading}
							/>
							<Grid>
								<Grid.Col span={6}>
									<DatePickerInput
										label="Published Date"
										placeholder="DD/MM/YYYY"
										valueFormat="DD/MM/YYYY"
										value={
											form.values.publishedDate
												? new Date(
														form.values.publishedDate
												  )
												: null
										}
										onChange={(value) =>
											form.setFieldValue(
												"publishedDate",
												value ? value.toISOString() : ""
											)
										}
										disabled={loading}
									/>
								</Grid.Col>
								<Grid.Col span={3}>
									<NumberInput
										label="Quantity"
										min={0}
										key={form.key("quantity")}
										{...form.getInputProps("quantity")}
										disabled={loading}
									/>
								</Grid.Col>
								<Grid.Col span={3}>
									<NumberInput
										label="Available"
										min={0}
										max={form.values.quantity}
										key={form.key("available")}
										{...form.getInputProps("available")}
										disabled={loading}
									/>
								</Grid.Col>
							</Grid>
							<MultiSelect
								label="Categories"
								data={categories.data.map((c) => ({
									value: c._id,
									label: c.name,
								}))}
								placeholder="Select categories"
								key={form.key("category")}
								{...form.getInputProps("category")}
								hidePickedOptions
								disabled={loading}
							/>
						</Stack>
					</Grid.Col>
				</Grid>
			</Stack>
		</form>
	)
}

export default AddBookPage
