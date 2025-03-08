import { IconBrandGoogleFilled } from "@tabler/icons-react"
import { Button, Container, Paper, Text, Title } from "@mantine/core"
import { useState } from "react"
import { API_URL } from "@/utils/api"

export function LoginPage() {
	const [isLoading, setIsLoading] = useState<boolean>(false)

	const handleGoogleSignIn = async () => {
		try {
			setIsLoading(true)
			console.log("Redirecting to Google OAuth...")

			window.location.replace(`${API_URL}/auth/google`)
		} catch (error) {
			console.error("An unexpected error occurred:", error)
		} finally {
			setIsLoading(false)
		}
	}
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<Container size={420} my={40}>
				<Title ta="center" className="font-bold">
					Welcome back!
				</Title>
				<Text c="dimmed" size="sm" ta="center" mt={5}>
					Login to library management admin system
				</Text>

				<Paper withBorder shadow="md" p={30} mt={30} radius="md">
					<Button
						fullWidth
						leftSection={<IconBrandGoogleFilled size={16} />}
						loading={isLoading}
						onClick={handleGoogleSignIn}
					>
						Sign in
					</Button>
				</Paper>
			</Container>
		</div>
	)
}
