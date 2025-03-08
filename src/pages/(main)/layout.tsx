import { AppShell } from "@mantine/core"
import { Outlet } from "react-router"
import MainLayoutHeader from "./_components/header"
import MainLayoutNavbar from "./_components/navbar"

function MainLayout() {
	return (
		<AppShell
			header={{ height: 60 }}
			navbar={{
				width: 240,
				breakpoint: "sm",
				collapsed: { mobile: true },
			}}
			padding="md"
		>
			<MainLayoutHeader />
			<MainLayoutNavbar />
			<AppShell.Main>
				<Outlet />
			</AppShell.Main>
		</AppShell>
	)
}

export default MainLayout
