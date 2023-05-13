"use client"

import { useState } from "react"

import { FromOptions, OpenAPI_SCHEMA, ToOptions } from "@/lib/convert/index"
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

  const [from, setFrom] = useState<FromOptions | null>(null)
  const [to, setTo] = useState<ToOptions | null>(null)

  const requiredIngredients = from === "memos" ? ["OpenAPI"] : null
  const [ingredients, setIngredients] = useState<string[]>([])

  const handleConvert = () => {
    if (
      from === "memos" &&
      to === "local" &&
      OpenAPI_SCHEMA.safeParse(ingredients[0]).success
    ) {
      const url =
        "/api" +
        "?from=" +
        from +
        "&to=" +
        to +
        "&OpenAPI=" +
        encodeURIComponent(ingredients[0])

      const a = document.createElement("a")
      a.href = url
      a.target = "_blank"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } else {
      toast({
        title: "Please input a valid ingredient",
        description: "OpenAPI is required for converting from Memos to Local",
      })
    }
  }

  return (
    <>
      <div>
        <div className="flex gap-4">
          <Select
            value={from || undefined}
            onValueChange={(value) => setFrom(value as FromOptions)}
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
            onValueChange={(value) => setTo(value as ToOptions)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="To" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="local">Local</SelectItem>
            </SelectContent>
          </Select>

          <Button
            disabled={
              !from ||
              !to ||
              (requiredIngredients?.length !== 0 &&
                ingredients.filter((ingredient) => ingredient.trim() !== "")
                  .length !== requiredIngredients?.length)
            }
            onClick={handleConvert}
          >
            Convert
          </Button>
        </div>

        {requiredIngredients?.length !== 0 &&
          requiredIngredients?.map((ingredient, index) => (
            <div className="mt-4">
              <p className="text-sm font-semibold text-gray-500">
                Required ingredient:
              </p>
              <Input
                className="mt-2 max-w-[620px]"
                placeholder={ingredient}
                type="text"
                id="ingredient"
                name="ingredient"
                value={ingredients[index] || ""}
                onChange={(event) =>
                  setIngredients((pre) => {
                    const newIngredients = [...pre]
                    newIngredients[index] = event.target.value
                    return newIngredients
                  })
                }
              />
            </div>
          ))}
      </div>
    </>
  )
}
