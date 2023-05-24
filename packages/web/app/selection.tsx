import Link from "next/link"

import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"

export default function Selection() {
	return (
		<div className="flex flex-wrap gap-6">
			<Link href="/memos-to-local">
				<Card>
					<CardHeader>
						<CardTitle>Memos -{">"} Local</CardTitle>
					</CardHeader>
					<CardContent>
						Download your memos and resources as a zip file.
					</CardContent>
					<CardFooter>1. OpenAPI</CardFooter>
				</Card>
			</Link>
			<Link href="/memos-to-notion">
				<Card>
					<CardHeader>
						<CardTitle>Memos -{">"} Notion</CardTitle>
					</CardHeader>
					<CardContent>Sync your Memos to Notion Database.</CardContent>
					<CardFooter>
						<p>1. OpenAPI</p>
						<p>2. Notion Token</p>
						<p>3. Notion Database ID</p>
					</CardFooter>
				</Card>
			</Link>
			<Link href="/google-keep-to-memos">
				<Card>
					<CardHeader>
						<CardTitle>Google Keep -{">"} Memos</CardTitle>
					</CardHeader>
					<CardContent>Import your Google Keep notes to Memos.</CardContent>
					<CardFooter>
						<p>1. Google Keep Takeout</p>
						<p>2. OpenAPI</p>
					</CardFooter>
				</Card>
			</Link>
		</div>
	)
}
