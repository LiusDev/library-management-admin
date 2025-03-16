import { useAuth } from "@/store/useAuthStore"
import { Role } from "@/types"
import { AppShell, Button, Stack } from "@mantine/core"
import {
	IconBook,
	IconBookDownload,
	IconCategory,
	IconUsers,
} from "@tabler/icons-react"
import { useMemo } from "react"
import { Link, useLocation } from "react-router"

const menuItems = [
	{
		title: "Borrow Transaction",
		href: "/borrow-transaction",
		icon: IconBookDownload,
		roles: [Role.STAFF, Role.ADMIN],
	},
	{
		title: "Category",
		href: "/category",
		icon: IconCategory,
		roles: [Role.STAFF, Role.ADMIN],
	},
	{
		title: "Book",
		href: "/book",
		icon: IconBook,
		roles: [Role.STAFF, Role.ADMIN],
	},
	{
		title: "User",
		href: "/user",
		icon: IconUsers,
		roles: [Role.ADMIN],
	},
]

const MainLayoutNavbar = () => {
	const { pathname } = useLocation()
	const { user } = useAuth()

	const renderMenuItems = useMemo(() => {
		return menuItems.filter((item) =>
			item.roles.includes(user?.role as Role)
		)
	}, [user])

	return (
		<AppShell.Navbar p="md">
			<Stack gap={4}>
				{renderMenuItems.map((item) => (
					<Button
						key={item.href}
						component={Link}
						to={item.href}
						leftSection={<item.icon size={18} />}
						justify="start"
						variant={
							pathname.startsWith(item.href) ? "filled" : "subtle"
						}
					>
						{item.title}
					</Button>
				))}
			</Stack>
		</AppShell.Navbar>
	)
}

export default MainLayoutNavbar
