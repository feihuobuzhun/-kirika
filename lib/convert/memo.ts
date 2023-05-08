import JSZip from "jszip"

export const FROM_OPTIONS = ["memos"] as const
export const TO_OPTIONS = ["local"] as const

export type FromOption = (typeof FROM_OPTIONS)[number]
export type ToOption = (typeof TO_OPTIONS)[number]

export async function convertMemoToLocalZip(openAPI: string) {
  const url = new URL(openAPI)
  const memos = (await fetch(openAPI).then((res) => res.json())) as MemoList
  const memoList = (
    await Promise.all(
      memos.data.map(async (memo) => ({
        id: memo.id,
        created: memo.createdTs,
        updated: memo.updatedTs,
        content: memo.content,
        resourceList: await Promise.all(
          memo.resourceList.map(async (resource) => {
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
              content: await fetch(memoResourceUrl).then((res) =>
                res.arrayBuffer()
              ),
            }
          })
        ),
      }))
    )
  ).map((memo) => ({
    ...memo,
    content: `---
date: ${new Date(memo.created * 1000).toISOString()}
updated: ${new Date(memo.updated * 1000).toISOString()}
---

${memo.content}
${
  memo.resourceList.length > 0
    ? `
${memo.resourceList
  .map(
    (resource) => `![${resource.filename}](./resources/${resource.filename})`
  )
  .join("\n")}
`
    : ""
}
`,
  }))

  const zip = new JSZip()

  for (const memo of memoList) {
    const folder = zip.folder(`${memo.id}`)
    const filename = `${memo.id}.md`
    const content = memo.content
    folder?.file(filename, content)
    if (memo.resourceList.length === 0) continue
    const resourceFolder = folder?.folder("resources")
    for (const { filename, content } of memo.resourceList) {
      resourceFolder?.file(filename, content)
    }
  }

  return await zip.generateAsync({
    type: "blob",
  })
}

export interface MemoList {
  data: Memo[]
}

export interface Memo {
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

export interface ResourceList {
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
