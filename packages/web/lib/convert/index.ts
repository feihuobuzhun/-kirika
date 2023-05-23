import { z } from "zod"

export const OPEN_API_SCHEMA = z
  .string()
  .trim()
  .min(1)
  .regex(/^(http|https):\/\/.*\/api\/memo\?openId=[a-zA-Z0-9]*/, {
    message: "OpenAPI url is invalid",
  })

export type OpenAPI = z.infer<typeof OPEN_API_SCHEMA>

export const WITH_FRONT_MATTER_SCHEMA = z.boolean()
export type WithFrontMatter = z.infer<typeof WITH_FRONT_MATTER_SCHEMA>
