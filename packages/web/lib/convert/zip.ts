import JSZip from "jszip"
import type { NotesWithAttachments } from "kirika"

export const zipMemos = (memosWithResource: NotesWithAttachments) => {
  const zip = new JSZip()
  const memoFolder = zip.folder("memos")
  const resourceFolder = zip.folder("resources")
  memosWithResource.notes.forEach((memo) => {
    memoFolder?.file(`${memo.title}.md`, memo.content)
  })
  memosWithResource.files.forEach((resource) => {
    resourceFolder?.file(resource.filename, resource.content)
  })
  return zip.generateAsync({ type: "blob" })
}
