import { AppShell, Button, Stack } from "@mantine/core"
import { IconBook, IconCategory } from "@tabler/icons-react"
import { Link, useLocation } from "react-router"

const menuItems = [
	{
		title: "Category",
		href: "/category",
		icon: IconCategory,
	},
	{
		title: "Book",
		href: "/book",
		icon: IconBook,
	},
]

const MainLayoutNavbar = () => {
	const { pathname } = useLocation()
	return (
		<AppShell.Navbar p="md">
			<Stack gap={4}>
				{menuItems.map((item) => (
					<Button
						key={item.href}
						component={Link}
						to={item.href}
						leftSection={<item.icon size={18} />}
						justify="start"
						variant={pathname === item.href ? "filled" : "subtle"}
					>
						{item.title}
					</Button>
				))}
			</Stack>
		</AppShell.Navbar>
	)
}

export default MainLayoutNavbar
