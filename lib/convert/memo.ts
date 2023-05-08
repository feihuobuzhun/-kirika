import JSZip from "jszip"

export const FROM_OPTIONS = ["memos"] as const
export const TO_OPTIONS = ["local"] as const

export type FromOption = (typeof FROM_OPTIONS)[number]
export type ToOption = (typeof TO_OPTIONS)[number]

export async function convertMemoToLocalZip(openAPI: string) {
  const url = new URL(openAPI)

  const memos = (await fetch(openAPI).then((res) => res.json())) as MemoList

  const resources = memos.data.map((memo) => memo.resourceList).flat()
  const filetedResources = resources.filter((resource, index) => {
    const firstIndex = resources.findIndex(
      (r) => r.publicId === resource.publicId
    )
    return index === firstIndex
  })

  const resourceList = await Promise.all(
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

  const memoList = memos.data.map((memo) => ({
    ...memo,
    content: `---
date: ${new Date(memo.createdTs * 1000).toISOString()}
updated: ${new Date(memo.updatedTs * 1000).toISOString()}
---

${memo.content}

${
  memo.resourceList.length > 0
    ? `${memo.resourceList
        .map(
          (resource) =>
            `![${resource.filename}](./resources/${resource.filename})`
        )
        .join("\n")}`
    : ""
}
`,
  }))

  const zip = new JSZip()

  const resourceFolder = zip?.folder("resources")
  resourceList.forEach((resource) => {
    resourceFolder?.file(resource.filename, resource.content)
  })

  memoList.forEach((memo) => {
    zip?.file(`${memo.id}.md`, memo.content)
  })

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
