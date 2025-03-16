import PageBreadCrumbs from "@/components/page-breadcrumbs"
import { deleteBook, updateBook, useBook } from "@/services/book"
import {
	Badge,
	Button,
	Grid,
	Group,
	Image,
	Loader,
	Stack,
	Text,
	Title,
	TextInput,
	Textarea,
	MultiSelect,
	NumberInput,
} from "@mantine/core"
import { useForm } from "@mantine/form"
import {
	IconArrowLeft,
	IconCancel,
	IconEdit,
	IconTrash,
	IconUpload,
} from "@tabler/icons-react"
import { useMemo, useState, useEffect } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router"
import { Dropzone, IMAGE_MIME_TYPE, FileWithPath } from "@mantine/dropzone"
import { DatePickerInput } from "@mantine/dates"
import dayjs from "dayjs"
import { useCategories } from "@/services/category"
import { notifications } from "@mantine/notifications"
import { useQueryClient } from "@tanstack/react-query"
import { closeAllModals, openConfirmModal } from "@mantine/modals"
import { MAX_FILE_SIZE } from "@/utils/constant"

const BookDetailsPage = () => {
	const [loading, setLoading] = useState(false)
	const { bookId } = useParams()
	const [searchParams, setSearchParams] = useSearchParams()
	const isEditMode = useMemo(
		() => searchParams.get("edit") === "true",
		[searchParams]
	)
	const { data: book, isLoading } = useBook(bookId)
	const { data: categories } = useCategories(1, 100)
	const navigate = useNavigate()
	const queryClient = useQueryClient()
	const [imageFile, setImageFile] = useState<FileWithPath>()
	const form = useForm({
		mode: "controlled",
		initialValues: {
			title: book?.title,
			description: book?.description,
			author: book?.author,
			publishedDate: book?.publishedDate,
			quantity: book?.quantity,
			available: book?.available,
			category: book?.category.map((c) => c._id),
		},
	})
	const setEditMode = (editMode: boolean) => {
		const params = new URLSearchParams(searchParams)
		if (editMode) params.set("edit", "true")
		else params.delete("edit")
		setSearchParams(params)
	}

	// Reset form values when book data changes
	useEffect(() => {
		if (book) {
			form.setValues({
				title: book.title,
				description: book.description,
				author: book.author,
				publishedDate: book.publishedDate,
				quantity: book.quantity,
				available: book.available,
				category: book.category.map((c) => c._id),
			})
		}
		// Remove form from the dependency array to avoid infinite loops
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [book])

	// Add a function to handle form submission
	const handleSave = async (values: typeof form.values) => {
		setLoading(true)
		try {
			await updateBook(bookId, {
				...values,
				cover: imageFile,
			})
			notifications.show({
				color: "green",
				title: "Book updated",
				message: "The book has been updated successfully",
			})
			setEditMode(false)
			queryClient.invalidateQueries({
				queryKey: ["book", bookId],
			})
			queryClient.invalidateQueries({
				queryKey: ["books"],
			})
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

	const handleDelete = async () => {
		setLoading(true)
		try {
			await deleteBook(bookId)
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
				queryKey: ["book", bookId],
			})
			navigate("/book")
		} catch (error) {
			console.error("Failed to delete book:", error)
			notifications.show({
				color: "red",
				title: "Failed to delete book",
				message: "An error occurred while deleting the book",
			})
		} finally {
			setLoading(false)
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

	if (isLoading)
		return (
			<div className="size-full grow flex items-center justify-center">
				<Loader size={"xl"} />
			</div>
		)

	if (!book)
		return (
			<div className="size-full grow flex items-center justify-center flex-col gap-4">
				<Title className="text-2xl">Book not found</Title>
				<Button
					leftSection={<IconArrowLeft size={16} />}
					onClick={() => navigate(-1)}
					disabled={loading}
				>
					Back
				</Button>
			</div>
		)
	return (
		<Stack>
			<PageBreadCrumbs
				items={[
					{
						name: "Book",
						url: "/book",
						disabled: loading,
					},
					{
						name: book.title,
						url: `/book/${book._id}`,
						disabled: loading,
					},
				]}
			/>
			<Group justify="space-between">
				<Title order={2}>
					{isEditMode ? "Edit book" : "Book details"}
				</Title>
				{!isEditMode ? (
					<Group>
						<Button
							color="red"
							variant="outline"
							leftSection={<IconTrash size={16} />}
							disabled={loading}
							onClick={handleOpenDeleteModal}
						>
							Delete book
						</Button>
						<Button
							leftSection={<IconEdit size={16} />}
							onClick={() => setEditMode(true)}
							disabled={loading}
						>
							Edit book
						</Button>
					</Group>
				) : (
					<Group>
						<Button
							color="gray"
							variant="outline"
							leftSection={<IconCancel size={16} />}
							onClick={() => navigate(-1)}
							disabled={loading}
						>
							Cancel
						</Button>
						<Button
							color="green"
							leftSection={<IconEdit size={16} />}
							onClick={() => form.onSubmit(handleSave)()}
							loading={loading}
						>
							Save
						</Button>
					</Group>
				)}
			</Group>
			{!isEditMode ? (
				<Group align="start" gap="xl">
					<Image
						src={book.cover}
						alt={book.title}
						radius={"md"}
						fit="cover"
						w={"400px"}
						className="aspect-11/16"
					/>
					<Stack gap={0}>
						<Title order={2} mb={4}>
							{book.title}
						</Title>
						<Text fs={"italic"} c={"dimmed"} mb={"sm"}>
							{book.author}
						</Text>
						<Text mb={"lg"}>{book.description}</Text>
						<Grid columns={4} gutter={"sm"}>
							<Grid.Col span={1}>
								<Text fw={500}>Published date:</Text>
							</Grid.Col>
							<Grid.Col span={3}>
								<Text>
									{dayjs(book.publishedDate).format(
										"DD/MM/YYYY"
									)}
								</Text>
							</Grid.Col>
							<Grid.Col span={1}>
								<Text fw={500}>Quantity:</Text>
							</Grid.Col>
							<Grid.Col span={3}>
								<Text>{book.quantity}</Text>
							</Grid.Col>
							<Grid.Col span={1}>
								<Text fw={500}>Available:</Text>
							</Grid.Col>
							<Grid.Col span={3}>
								<Text>{book.available}</Text>
							</Grid.Col>
							<Grid.Col span={1}>
								<Text fw={500}>Category:</Text>
							</Grid.Col>
							<Grid.Col span={3}>
								<Group gap={"sm"}>
									{book.category.map((c) => (
										<Badge key={c._id} color="blue">
											{c.name}
										</Badge>
									))}
								</Group>
							</Grid.Col>
						</Grid>
					</Stack>
				</Group>
			) : (
				<form onSubmit={form.onSubmit(handleSave)}>
					<Grid>
						<Grid.Col span={4}>
							<Stack align="center">
								<Image
									src={
										imageFile
											? URL.createObjectURL(imageFile)
											: book.cover
									}
									alt={book.title}
									radius={"md"}
									fit="cover"
									w={"400px"}
									className="aspect-11/16"
								/>
								<Dropzone
									accept={IMAGE_MIME_TYPE}
									onDrop={(files) => setImageFile(files[0])}
									className="border-dashed border-2 p-4 text-center"
									disabled={loading}
									maxSize={MAX_FILE_SIZE}
								>
									<Group justify="center" gap="sm">
										<IconUpload size={20} />
										<Text>Upload new cover image</Text>
									</Group>
								</Dropzone>
							</Stack>
						</Grid.Col>
						<Grid.Col span={8}>
							<Stack>
								<TextInput
									label="Title"
									required
									{...form.getInputProps("title")}
									disabled={loading}
								/>
								<TextInput
									label="Author"
									required
									{...form.getInputProps("author")}
									disabled={loading}
								/>
								<Textarea
									label="Description"
									autosize
									minRows={4}
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
													value?.toISOString()
												)
											}
											disabled={loading}
										/>
									</Grid.Col>
									<Grid.Col span={3}>
										<NumberInput
											label="Quantity"
											min={0}
											{...form.getInputProps("quantity")}
											disabled={loading}
										/>
									</Grid.Col>
									<Grid.Col span={3}>
										<NumberInput
											label="Available"
											min={0}
											max={form.values.quantity}
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
									value={form.values.category}
									onChange={(value) =>
										form.setFieldValue("category", value)
									}
									hidePickedOptions
									disabled={loading}
								/>
							</Stack>
						</Grid.Col>
					</Grid>
				</form>
			)}
		</Stack>
	)
}

export default BookDetailsPage
