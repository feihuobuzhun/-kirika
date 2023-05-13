import { z } from "zod"

export const FROM_OPTIONS = ["memos"] as const
export const FROM_OPTIONS_SCHEMA = z.enum(FROM_OPTIONS)
export type FromOptions = (typeof FROM_OPTIONS)[number]

export const TO_OPTIONS = ["local"] as const
export const TO_OPTIONS_SCHEMA = z.enum(TO_OPTIONS)
export type ToOptions = (typeof TO_OPTIONS)[number]

export const OpenAPI_SCHEMA = z
  .string()
  .trim()
  .min(1)
  .regex(/^(http|https):\/\/.*\/api\/memo\?openId=[a-zA-Z0-9]*/)

export type OpenAPI = z.infer<typeof OpenAPI_SCHEMA>
