import { readMemosFromOpenAPI } from "kirika"

import {
  FROM_OPTIONS_SCHEMA,
  OPEN_API_SCHEMA,
  TO_OPTIONS_SCHEMA,
} from "@/lib/convert"
import { zipMemos } from "@/lib/convert/zip"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const from = searchParams.get("from")
  const to = searchParams.get("to")

  if (
    !FROM_OPTIONS_SCHEMA.safeParse(from).success ||
    !TO_OPTIONS_SCHEMA.safeParse(to).success
  ) {
    return new Response("Invalid option value", { status: 400 })
  }

  const withMemosOpenAPI = OPEN_API_SCHEMA.safeParse(
    searchParams.get("openAPI")
  ).success

  if (from === "memos" && to === "local") {
    if (withMemosOpenAPI) {
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
    }
  } else if (from === "local" && to === "memos") {
  }
  return new Response("Unsupported conversion", { status: 400 })
}
