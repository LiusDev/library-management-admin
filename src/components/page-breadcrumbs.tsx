import { Breadcrumbs, Button, Group } from "@mantine/core"
import { useMemo } from "react"
import { Link } from "react-router"

interface Item {
	name: string
	url: string
	disabled?: boolean
}

interface PageBreadCrumbsProps {
	items: Item[]
}

const PageBreadCrumbs = ({ items }: PageBreadCrumbsProps) => {
	const renderItems = useMemo(
		() =>
			items.map((item) => (
				<Button
					key={item.url}
					size="compact-sm"
					component={Link}
					to={item.url}
					variant="subtle"
					disabled={item.disabled}
				>
					{item.name}
				</Button>
			)),
		[items]
	)

	return (
		<Group>
			<Breadcrumbs separatorMargin={4}>{renderItems}</Breadcrumbs>
		</Group>
	)
}

export default PageBreadCrumbs
