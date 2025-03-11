import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import {
	MantineUIProvider,
	ReactRouterProvider,
	TanstackQueryProvider,
} from "./providers"

import "./index.css"

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<TanstackQueryProvider>
			<MantineUIProvider>
				<ReactRouterProvider />
			</MantineUIProvider>
		</TanstackQueryProvider>
	</StrictMode>
)
