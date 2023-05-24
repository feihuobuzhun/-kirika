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
	id?: string
	title: string
	content: string
	/**
	 * file names of attachments or web links
	 */
	attachments:
		| string[]
		| {
				url: string
				markdown: string
		  }[]
	metadata: Metadata
}

export type NotesWithAttachments = {
	notes: Note[]
	files: Attachment[]
}
