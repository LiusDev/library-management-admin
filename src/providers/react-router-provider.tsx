import AuthLayout from "@/pages/(auth)/layout"
import { LoginPage } from "@/pages/(auth)/login"
import HomePage from "@/pages/(main)"
import BookPage from "@/pages/(main)/book"
import CategoryPage from "@/pages/(main)/category"
import MainLayout from "@/pages/(main)/layout"
import ErrorPage from "@/pages/404"
import { authLoader, nonAuthLoader } from "@/utils/loader"
import { createBrowserRouter, Outlet, RouterProvider } from "react-router"

const routers = createBrowserRouter([
	{
		path: "/",
		element: <Outlet />,
		errorElement: <ErrorPage />,
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
])

export const ReactRouterProvider = () => {
	return <RouterProvider router={routers} />
}
