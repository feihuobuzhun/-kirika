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
import { useToast } from "@/components/ui/use-toast"

export default function Selection() {
  const { toast } = useToast()

  const [from, setFrom] = useState<FromOption | null>(null)
  const [to, setTo] = useState<ToOption | null>(null)

  const requiredIngredient = from === "memos" ? "OpenAPI" : null
  const [ingredient, setIngredient] = useState<string | null>(null)

  const handleConvert = () => {
    try {
      if (
        !ingredient?.match(
          /^(http|https):\/\/.*\/api\/memo\?openId=[a-zA-Z0-9]*/
        )
      ) {
        throw new Error("Invalid OpenAPI URL")
      }

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
      a.target = "_blank"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } catch (error) {
      toast({
        title: "Please input a valid ingredient",
        description: (error as any).message,
      })
    }
  }

  return (
    <>
      <div>
        <div className="flex gap-4">
          <Select
            value={from || undefined}
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
            value={to || undefined}
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
            disabled={!from || !to || (!!requiredIngredient && !ingredient)}
            onClick={handleConvert}
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
              className="mt-2 max-w-[620px]"
              placeholder={requiredIngredient}
              type="text"
              id="ingredient"
              name="ingredient"
              value={ingredient || ""}
              onChange={(event) => setIngredient(event.target.value)}
            />
          </div>
        )}
      </div>
    </>
  )
}
