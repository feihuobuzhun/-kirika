import { readMemosFromOpenAPI } from "kirika"

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
      return new Response("Failed to convert", { status: 500 })
    }
  }
  return new Response("Unsupported conversion", { status: 400 })
}
