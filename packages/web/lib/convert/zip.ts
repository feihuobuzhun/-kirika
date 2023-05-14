import JSZip from "jszip"
import { MemosWithResource } from "kirika"

export const zipMemos = (memosWithResource: MemosWithResource) => {
  const zip = new JSZip()
  const memoFolder = zip.folder("memos")
  const resourceFolder = zip.folder("resources")
  memosWithResource.memos.forEach((memo) => {
    memoFolder?.file(`${memo.id}.md`, memo.content)
  })
  memosWithResource.resources.forEach((resource) => {
    resourceFolder?.file(resource.filename, resource.content)
  })
  return zip.generateAsync({ type: "blob" })
}
