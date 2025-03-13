import { useAuth } from "@/store/useAuthStore"
import { Avatar, Menu } from "@mantine/core"
import { IconLogout2 } from "@tabler/icons-react"
import { useNavigate } from "react-router"

const AvatarMenu = () => {
	const { user, logout } = useAuth()

	const navigate = useNavigate()
	const handleLogout = async () => {
		await logout()
		navigate("/login")
	}
	return (
		<Menu shadow="md" width={120} withArrow>
			<Menu.Target>
				<Avatar className="cursor-pointer" src={user?.avatar} />
			</Menu.Target>
			<Menu.Dropdown>
				<Menu.Item
					leftSection={<IconLogout2 size={16} />}
					onClick={handleLogout}
				>
					Sign out
				</Menu.Item>
			</Menu.Dropdown>
		</Menu>
	)
}

export default AvatarMenu
