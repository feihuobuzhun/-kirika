import { Attachment, Note, NotesWithAttachments } from "../common/types"

type MemoAPIResponse = {
	data: Memo[]
}

type Memo = {
	id: number
	rowStatus: string
	creatorId: number
	createdTs: number
	updatedTs: number
	content: string
	visibility: string
	pinned: boolean
	creatorName: string
	resourceList: ResourceList[]
	relationList: any
}

type ResourceList = {
	id: number
	creatorId: number
	createdTs: number
	updatedTs: number
	filename: string
	internalPath: string
	externalLink: string
	type: string
	size: number
	publicId: string
	linkedMemoAmount: number
}

export async function readMemosFromOpenAPI(
	openAPI: string,
	withFrontMatter = false
): Promise<NotesWithAttachments> {
	const url = new URL(openAPI)

	const memos = (await fetch(openAPI).then((res) =>
		res.json()
	)) as MemoAPIResponse

	const resources = memos.data.map((memo) => memo.resourceList).flat()
	const filetedResources = resources.filter((resource, index) => {
		const firstIndex = resources.findIndex(
			(r) => r.publicId === resource.publicId
		)
		return index === firstIndex
	})

	const files: Attachment[] = await Promise.all(
		filetedResources.map(async (resource) => {
			// external link first
			const memoResourceUrl =
				resource.externalLink ||
				url.origin +
					"/o/r/" +
					resource.id +
					"/" +
					resource.publicId +
					"/" +
					resource.filename

			return {
				filename: resource.filename,
				content: await fetch(memoResourceUrl).then((res) => res.arrayBuffer()),
			}
		})
	)

	const notes: Note[] = memos.data.map((memo) => ({
		title: memo.id.toString(),
		attachments: memo.resourceList.map((resource) => resource.filename),
		metadata: {
			createdAt: String(memo.createdTs * 1000),
			updatedAt: String(memo.updatedTs * 1000),
		},
		content:
			`
${
	withFrontMatter
		? `
---
date: ${new Date(memo.createdTs * 1000).toISOString()}
updated: ${new Date(memo.createdTs * 1000).toISOString()}
---
`
		: ""
}
${memo.content}

${
	memo.resourceList.length > 0
		? `${memo.resourceList
				.map(
					(resource) =>
						`![${resource.filename}](../resources/${resource.filename})`
				)
				.join("\n")}`
		: ""
}
`.trim() + "\n",
	}))

	return {
		notes,
		files,
	}
}
