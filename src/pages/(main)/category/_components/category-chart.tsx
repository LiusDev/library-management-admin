import { Category } from "@/types"
import { BarChart } from "@mantine/charts"
import { Stack, Title } from "@mantine/core"

interface CategoryChartProps {
	data: (Category & { bookCount: number })[]
}

const CategoryChart = ({ data }: CategoryChartProps) => {
	return (
		<Stack>
			<Title order={2}>Top 5 categories per page</Title>
			<BarChart
				mt={"md"}
				h={"100%"}
				data={
					data
						?.sort((a, b) => b.bookCount - a.bookCount)
						?.slice(0, 5) || []
				}
				dataKey="name"
				series={[
					{
						name: "bookCount",
						label: "Books",
						color: "teal.6",
					},
				]}
				tickLine="y"
			/>
		</Stack>
	)
}

export default CategoryChart
