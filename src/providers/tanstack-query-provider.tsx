import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

interface TanstackQueryProviderProps {
	children: React.ReactNode
}

export const TanstackQueryProvider = ({
	children,
}: TanstackQueryProviderProps) => {
	return (
		<QueryClientProvider client={queryClient}>
			{children}
		</QueryClientProvider>
	)
}
