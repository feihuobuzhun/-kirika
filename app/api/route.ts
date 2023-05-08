import {
  FROM_OPTIONS_SCHEMA,
  OpenAPI_SCHEMA,
  TO_OPTIONS_SCHEMA,
} from "@/lib/convert"
import { convertMemoToLocalZip } from "@/lib/convert/memo"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const from = searchParams.get("from")
  const to = searchParams.get("to")

  if (
    FROM_OPTIONS_SCHEMA.safeParse(from).success &&
    TO_OPTIONS_SCHEMA.safeParse(to).success
  ) {
    if (from === "memos" && to === "local") {
      if (OpenAPI_SCHEMA.safeParse(searchParams.get("OpenAPI")).success) {
        const OpenAPI = searchParams.get("OpenAPI") as string
        const res = await convertMemoToLocalZip(OpenAPI)
        return new Response(res, {
          headers: {
            "Content-Type": "application/zip",
            "Content-Disposition": `attachment; filename="memos.zip"`,
          },
        })
      } else {
        return new Response("Invalid OpenAPI", { status: 400 })
      }
    }
  } else {
    return new Response("Invalid option value", { status: 400 })
  }
}
