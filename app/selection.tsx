"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const FROM_OPTIONS = ["memos"] as const
const TO_OPTIONS = ["local"] as const

type FromOption = (typeof FROM_OPTIONS)[number]
type ToOption = (typeof TO_OPTIONS)[number]

export default function Selection() {
  const [from, setFrom] = useState<FromOption | undefined>()
  const [to, setTo] = useState<ToOption | undefined>()

  const requiredIngredient = from === "memos" ? "OpenAPI" : undefined
  const [ingredient, setIngredient] = useState<string | undefined>()

  return (
    <div>
      <div className="flex gap-4">
        <Select
          value={from}
          onValueChange={(value) => setFrom(value as FromOption)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="From" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="memos">Memos</SelectItem>
          </SelectContent>
        </Select>

        <Select value={to} onValueChange={(value) => setTo(value as ToOption)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="To" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="local">Local</SelectItem>
          </SelectContent>
        </Select>

        <Button disabled={!from || !to || (requiredIngredient && !ingredient)}>
          Convert
        </Button>
      </div>

      {requiredIngredient && (
        <div className="mt-4">
          <p className="text-sm font-semibold text-gray-500">
            Required ingredients:
          </p>
          <Input
            className="mt-2"
            placeholder={requiredIngredient}
            value={ingredient}
            onChange={(event) => setIngredient(event.target.value)}
          />
        </div>
      )}
    </div>
  )
}
