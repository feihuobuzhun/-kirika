export type Attachment = {
	filename: string
	content: ArrayBuffer
	mimetype?: string
}

export type Metadata = {
	createdAt: string
	updatedAt: string
} & {
	[key: string]: string
}

export type Note = {
	title: string
	content: string
	attachments: string[]
	metadata: Metadata
}

export type NotesWithAttachments = {
	notes: Note[]
	files: Attachment[]
}
