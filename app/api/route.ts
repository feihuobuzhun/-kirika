import { NextResponse } from "next/server"

import { convertMemoToLocalZip } from "@/lib/convert/memo"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const ingredients = searchParams.get("ingredients")
  const from = searchParams.get("from")
  const to = searchParams.get("to")

  if (
    (Array.isArray(ingredients) && ingredients.length > 1) ||
    typeof ingredients === "string"
  ) {
    if (from === "memos" && to === "local") {
      const ingredient = Array.isArray(ingredients)
        ? ingredients[0]
        : ingredients
      const res = await convertMemoToLocalZip(ingredient)
      return new Response(res, {
        headers: {
          "Content-Type": "application/zip",
          "Content-Disposition": `attachment; filename="memos.zip"`,
        },
      })
    }
  } else {
    return NextResponse.json({ status: "bad request", progress: 0 })
  }
}
