import AuthLayout from "@/pages/(auth)/layout"
import { LoginPage } from "@/pages/(auth)/login"
import HomePage from "@/pages/(main)"
import BookPage from "@/pages/(main)/book"
import BookDetailsPage from "@/pages/(main)/book/[bookId]"
import AddBookPage from "@/pages/(main)/book/new"
import BorrowTransctionsPage from "@/pages/(main)/borrow-transaction"
import CategoryPage from "@/pages/(main)/category"
import MainLayout from "@/pages/(main)/layout"
import UserPage from "@/pages/(main)/user"
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
									path: "/borrow-transaction",
									element: <Outlet />,
									children: [
										{
											index: true,
											element: <BorrowTransctionsPage />,
										},
									],
								},
								{
									path: "/category",
									element: <CategoryPage />,
								},
								{
									path: "/book",
									element: <Outlet />,
									children: [
										{
											index: true,
											element: <BookPage />,
										},
										{
											path: "add",
											element: <AddBookPage />,
										},
										{
											path: ":bookId",
											element: <BookDetailsPage />,
										},
									],
								},
								{
									path: "/user",
									element: <Outlet />,
									children: [
										{
											index: true,
											element: <UserPage />,
										},
									],
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
