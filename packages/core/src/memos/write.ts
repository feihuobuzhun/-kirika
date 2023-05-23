import { Attachment, NotesWithAttachments } from "../common/types"

interface CreateBlobAPIResponse {
	data: Data
}

interface Data {
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

async function writeFile(
	openAPI: string,
	attachment: Attachment
): Promise<CreateBlobAPIResponse> {
	const openId = new URL(openAPI).searchParams.get("openId")
	const baseURI = new URL(openAPI).origin

	const postData = new FormData()
	postData.append(
		"file",
		new Blob([attachment.content], {
			type: attachment.mimetype,
		}),
		attachment.filename
	)

	return await fetch(baseURI + "/api/resource/blob" + "?openId=" + openId, {
		body: postData,
		method: "POST",
	}).then((res) => res.json() as Promise<CreateBlobAPIResponse>)
}

export async function writeMemosWithResources(
	openAPI: string,
	notesWithAttachments: NotesWithAttachments
) {
	const createdResourceList = (
		await Promise.all(
			notesWithAttachments.files.map((attachment) =>
				writeFile(openAPI, attachment)
			)
		)
	).map((res) => res.data)

	for (const note of notesWithAttachments.notes.reverse()) {
		const postData = {
			content: note.content,
			visibility: "PRIVATE",
			resourceIdList: createdResourceList
				.filter((r) => note.attachments.includes(r.filename))
				.map((r) => r.id),
			relationList: [],
		}

		await fetch(openAPI, {
			headers: {
				"content-type": "application/json",
			},
			body: JSON.stringify(postData),
			method: "POST",
		})
	}
}
