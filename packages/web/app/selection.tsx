"use client"

import { useState } from "react"

import { FromOptions, OpenAPI_SCHEMA, ToOptions } from "@/lib/convert/index"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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

  const defaultIngredients =
    from === "memos" ? { OpenAPI: "", WithFrontMatter: false } : null
  const [ingredients, setIngredients] = useState<(string | boolean)[]>([])

  const handleConvert = () => {
    if (
      from === "memos" &&
      to === "local" &&
      OpenAPI_SCHEMA.safeParse(ingredients[0]).success
    ) {
      let url = "/api" + "?from=" + from + "&to=" + to

      if (defaultIngredients && ingredients.length > 0) {
        url += Object.entries(defaultIngredients).map((pair, index) => {
          return (
            "&" + pair[0] + "=" + encodeURIComponent(String(ingredients[index]))
          )
        })
      }

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
              (defaultIngredients !== null &&
                ingredients.length !== Object.keys(defaultIngredients).length)
            }
            onClick={handleConvert}
          >
            Convert
          </Button>
        </div>

        {defaultIngredients && (
          <div className="mt-4 space-y-4">
            <p className="text-sm font-semibold text-gray-500">
              Required ingredient:
            </p>
            {Object.entries(defaultIngredients).map((pair, index) => {
              if (typeof pair[1] === "boolean") {
                return (
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="WithFrontMatter"
                      checked={Boolean(ingredients[index])}
                      onCheckedChange={(checked) =>
                        setIngredients((pre) => {
                          const newIngredients = [...pre]
                          newIngredients[index] = checked
                          return newIngredients
                        })
                      }
                    />
                    <label
                      htmlFor="WithFrontMatter"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {pair[0]}
                    </label>
                  </div>
                )
              }
              return (
                <Input
                  className="mt-2 max-w-[620px]"
                  placeholder={pair[0]}
                  type="text"
                  id="ingredient"
                  name="ingredient"
                  value={ingredients[index] as string}
                  onChange={(event) =>
                    setIngredients((pre) => {
                      const newIngredients = [...pre]
                      newIngredients[index] = event.target.value
                      return newIngredients
                    })
                  }
                />
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
