import {
  readGoogleKeepTakeout,
  readMemosFromOpenAPI,
  writeMemosWithResources,
} from "kirika"

import { zipMemos } from "@/lib/convert/zip"

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  const from = searchParams.get("from")
  const to = searchParams.get("to")

  if (from === "memos" && to === "local") {
    try {
      const OpenAPI = searchParams.get("openAPI") as string
      const WithFrontMatter = searchParams.get("withFrontMatter") === "true"
      const memosWithResource = await readMemosFromOpenAPI(
        OpenAPI,
        WithFrontMatter
      )
      const zip = await zipMemos(memosWithResource)
      return new Response(zip, {
        headers: {
          "Content-Type": "application/zip",
          "Content-Disposition": `attachment; filename="memos.zip"`,
        },
      })
    } catch (error) {
      console.error(error)
      return new Response("Failed to convert", { status: 500 })
    }
  } else if (from === "google-keep" && to === "memos") {
    try {
      const openAPI = searchParams.get("openAPI") as string
      // read google keep takeout zip from request body
      const zip = await request.arrayBuffer()
      const memosWithResource = await readGoogleKeepTakeout(zip)
      await writeMemosWithResources(openAPI, memosWithResource)
      return new Response("Success", { status: 200 })
    } catch (error) {
      console.error(error)
      return new Response("Failed to convert", { status: 500 })
    }
  }
  return new Response("Unsupported conversion", { status: 400 })
}
