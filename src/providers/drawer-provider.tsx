import { Drawer, DrawerProps } from "@mantine/core"
import { createContext, useCallback, useState, useEffect, useMemo } from "react"

// Drawer configuration type
interface DrawerOptions extends Omit<DrawerProps, "opened" | "onClose"> {
	title?: React.ReactNode
	children: React.ReactNode
	id?: string
}

// Context type
interface DrawerContextType {
	openDrawer: (options: DrawerOptions) => string
	closeDrawer: (id: string) => void
	closeAll: () => void
}

// Create context
// eslint-disable-next-line react-refresh/only-export-components
export const DrawerContext = createContext<DrawerContextType | null>(null)

// Global drawer context for standalone functions
let globalDrawerContext: DrawerContextType | null = null

// eslint-disable-next-line react-refresh/only-export-components
export function getGlobalDrawerContext() {
	return globalDrawerContext
}

// Provider component
export function DrawerProvider({ children }: { children: React.ReactNode }) {
	// State to store all drawers
	const [drawers, setDrawers] = useState<
		Array<
			DrawerOptions & {
				id: string
				visible: boolean
				pendingOpen: boolean
			}
		>
	>([])

	// Generate unique ID for drawers
	const generateId = useCallback(() => {
		return `drawer-${Math.random().toString(36).substring(2, 9)}`
	}, [])

	// Open a drawer - first add with pendingOpen flag
	const openDrawer = useCallback(
		(options: DrawerOptions) => {
			const id = options.id || generateId()

			// Add drawer to state initially with visible=false
			setDrawers((current) => [
				...current.filter((drawer) => drawer.id !== id),
				{ ...options, id, visible: false, pendingOpen: true },
			])

			return id
		},
		[generateId]
	)

	// Handle pending open drawers
	useEffect(() => {
		// Find drawers with pendingOpen flag
		const pendingDrawers = drawers.filter((drawer) => drawer.pendingOpen)

		if (pendingDrawers.length > 0) {
			// Use requestAnimationFrame to ensure browser registers the initial closed state
			const timerId = requestAnimationFrame(() => {
				setDrawers((current) =>
					current.map((drawer) =>
						drawer.pendingOpen
							? { ...drawer, visible: true, pendingOpen: false }
							: drawer
					)
				)
			})

			return () => cancelAnimationFrame(timerId)
		}
	}, [drawers])

	// Close a drawer
	const closeDrawer = useCallback((id: string) => {
		// Mark drawer as not visible (for animation)
		setDrawers((current) =>
			current.map((drawer) =>
				drawer.id === id ? { ...drawer, visible: false } : drawer
			)
		)

		// Remove drawer after animation completes
		setTimeout(() => {
			setDrawers((current) =>
				current.filter((drawer) => drawer.id !== id)
			)
		}, 300)
	}, [])

	// Close all drawers
	const closeAll = useCallback(() => {
		// Mark all drawers as not visible
		setDrawers((current) =>
			current.map((drawer) => ({ ...drawer, visible: false }))
		)

		// Remove all drawers after animation completes
		setTimeout(() => {
			setDrawers([])
		}, 300)
	}, [])

	// Context value
	const contextValue = useMemo(
		() => ({
			openDrawer,
			closeDrawer,
			closeAll,
		}),
		[openDrawer, closeDrawer, closeAll]
	)

	// Set global context for standalone functions
	useEffect(() => {
		globalDrawerContext = contextValue
		return () => {
			globalDrawerContext = null
		}
	}, [contextValue])

	return (
		<DrawerContext.Provider value={contextValue}>
			{children}

			{drawers.map((drawer) => {
				// Extract our custom tracking props that shouldn't be passed to the DOM
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const { visible, pendingOpen, ...drawerProps } = drawer

				return (
					<Drawer
						key={drawer.id}
						opened={visible}
						onClose={() => closeDrawer(drawer.id)}
						position="right"
						{...drawerProps}
					>
						{drawer.children}
					</Drawer>
				)
			})}
		</DrawerContext.Provider>
	)
}
