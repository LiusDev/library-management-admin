import { useContext } from "react"
import {
	DrawerContext,
	getGlobalDrawerContext,
} from "@/providers/drawer-provider"
import type { DrawerProps } from "@mantine/core"

// Drawer options type
interface DrawerOptions extends Omit<DrawerProps, "opened" | "onClose"> {
	title?: React.ReactNode
	children: React.ReactNode
	id?: string
}

// Hook for use within components
export function useDrawer() {
	const context = useContext(DrawerContext)
	if (!context) {
		throw new Error("useDrawer must be used within a DrawerProvider")
	}
	return context
}

// Functions for use outside components
export function openDrawer(options: DrawerOptions): string {
	const context = getGlobalDrawerContext()
	if (!context) {
		throw new Error("DrawerProvider not initialized")
	}
	return context.openDrawer(options)
}

export function closeDrawer(id: string): void {
	const context = getGlobalDrawerContext()
	if (!context) {
		throw new Error("DrawerProvider not initialized")
	}
	context.closeDrawer(id)
}

export function closeAllDrawers(): void {
	const context = getGlobalDrawerContext()
	if (!context) {
		throw new Error("DrawerProvider not initialized")
	}
	context.closeAll()
}
