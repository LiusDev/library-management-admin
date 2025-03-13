import AuthLayout from "@/pages/(auth)/layout"
import { LoginPage } from "@/pages/(auth)/login"
import HomePage from "@/pages/(main)"
import BookPage from "@/pages/(main)/book"
import CategoryPage from "@/pages/(main)/category"
import MainLayout from "@/pages/(main)/layout"
import ErrorPage from "@/pages/404"
import { authLoader, nonAuthLoader } from "@/utils/loader"
import { JSX, useMemo } from "react"
import { createBrowserRouter, Outlet, RouterProvider } from "react-router"

export const ReactRouterProvider = ({
	uiComponent,
}: {
	uiComponent: JSX.ElementType
}) => {
	const UIComponent = uiComponent
	const routers = useMemo(
		() =>
			createBrowserRouter([
				{
					path: "/",
					element: (
						<UIComponent>
							<Outlet />
						</UIComponent>
					),
					errorElement: (
						<UIComponent>
							<ErrorPage />
						</UIComponent>
					),
					children: [
						{
							path: "/",
							element: <AuthLayout />,
							loader: nonAuthLoader,
							children: [
								{
									path: "/login",
									element: <LoginPage />,
								},
							],
						},
						{
							path: "/",
							element: <MainLayout />,
							loader: authLoader,
							children: [
								{
									index: true,
									element: <HomePage />,
								},
								{
									path: "/category",
									element: <CategoryPage />,
								},
								{
									path: "/book",
									element: <BookPage />,
								},
							],
						},
					],
				},
			]),
		[UIComponent]
	)
	return <RouterProvider router={routers} />
}
