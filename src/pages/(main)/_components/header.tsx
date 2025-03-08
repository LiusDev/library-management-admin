import { AppShell, Group, Title, useMantineTheme } from "@mantine/core"
import AvatarMenu from "./avatar-menu"
import { Link } from "react-router"
import { IconBooks } from "@tabler/icons-react"

const MainLayoutHeader = () => {
	const theme = useMantineTheme()
	return (
		<AppShell.Header>
			<Group justify="space-between" align="center" h={"100%"} px={"md"}>
				<Link to="/" className="flex items-center justify-center gap-2">
					<IconBooks
						size={24}
						color={theme.colors[theme.primaryColor][5]}
					/>
					<Title order={3} c={theme.colors[theme.primaryColor][5]}>
						BookBuddy
					</Title>
				</Link>
				<AvatarMenu />
			</Group>
		</AppShell.Header>
	)
}

export default MainLayoutHeader
