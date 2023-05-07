"use client"

import { useState } from "react"

import { FromOption, ToOption } from "@/lib/convert/memo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function Selection() {
  const [from, setFrom] = useState<FromOption | undefined>()
  const [to, setTo] = useState<ToOption | undefined>()

  const requiredIngredient = from === "memos" ? "OpenAPI" : undefined
  const [ingredient, setIngredient] = useState<string | undefined>()

  return (
    <>
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

          <Select
            value={to}
            onValueChange={(value) => setTo(value as ToOption)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="To" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="local">Local</SelectItem>
            </SelectContent>
          </Select>

          <Button
            disabled={!from || !to || (requiredIngredient && !ingredient)}
            onClick={() => {
              const url =
                "/api" +
                "?from=" +
                from +
                "&to=" +
                to +
                "&ingredients=" +
                encodeURIComponent(ingredient || "")

              const a = document.createElement("a")
              a.href = url
              document.body.appendChild(a)
              a.click()
              document.body.removeChild(a)
            }}
          >
            Convert
          </Button>
        </div>

        {requiredIngredient && (
          <div className="mt-4">
            <p className="text-sm font-semibold text-gray-500">
              Required ingredient:
            </p>
            <Input
              className="mt-2"
              placeholder={requiredIngredient}
              type="text"
              id="ingredient"
              name="ingredient"
              value={ingredient}
              onChange={(event) => setIngredient(event.target.value)}
            />
          </div>
        )}
      </div>
    </>
  )
}
