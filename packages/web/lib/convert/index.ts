import { z } from "zod"

export const FROM_OPTIONS = ["memos"] as const
export const FROM_OPTIONS_SCHEMA = z.enum(FROM_OPTIONS)
export type FromOptions = (typeof FROM_OPTIONS)[number]

export const TO_OPTIONS = ["local"] as const
export const TO_OPTIONS_SCHEMA = z.enum(TO_OPTIONS)
export type ToOptions = (typeof TO_OPTIONS)[number]

export const OPEN_API_SCHEMA = z
  .string()
  .trim()
  .min(1)
  .regex(/^(http|https):\/\/.*\/api\/memo\?openId=[a-zA-Z0-9]*/)

export type OpenAPI = z.infer<typeof OPEN_API_SCHEMA>

export const WITH_FRONT_MATTER_SCHEMA = z.boolean()
export type WithFrontMatter = z.infer<typeof WITH_FRONT_MATTER_SCHEMA>

export const INGREDIENTS_FOR_FROM_MEMOS_SCHEMA = z.object({
  openAPI: OPEN_API_SCHEMA,
  withFrontMatter: WITH_FRONT_MATTER_SCHEMA,
})

export type IngredientsForFromMemos = z.infer<
  typeof INGREDIENTS_FOR_FROM_MEMOS_SCHEMA
>
