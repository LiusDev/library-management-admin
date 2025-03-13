import "@mantine/core/styles.css"
import "@mantine/dates/styles.css"
import "@mantine/notifications/styles.css"
import "@mantine/charts/styles.css"
import "mantine-datatable/styles.layer.css"

import { createTheme, MantineColorsTuple, MantineProvider } from "@mantine/core"
import { Notifications } from "@mantine/notifications"
import { ModalsProvider } from "@mantine/modals"
import { DrawerProvider } from "./drawer-provider"

const myColor: MantineColorsTuple = [
	"#ffe9ff",
	"#fed1fd",
	"#faa1f6",
	"#f66ef1",
	"#f243eb",
	"#f028e9",
	"#f018e8",
	"#d609ce",
	"#bf00b9",
	"#a700a1",
]

const theme = createTheme({
	colors: {
		myColor,
	},
	primaryColor: "myColor",
})

export const MantineUIProvider = ({
	children,
}: {
	children: React.ReactNode
}) => {
	return (
		<MantineProvider theme={theme}>
			<ModalsProvider>
				<DrawerProvider>
					{children}
					<Notifications />
				</DrawerProvider>
			</ModalsProvider>
		</MantineProvider>
	)
}
