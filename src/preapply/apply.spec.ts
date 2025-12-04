import { describe, expect, test } from "vitest"
import { apply } from "./apply"
import { context } from "./context"
import { create } from "./create"
import { derive } from "./derive"

describe(apply, () => {
  test(context, () => {
    const ref = { name: "jason" }
    const schema = context<{ name: string }>()
    const result = apply(schema, ref)
    expect(result).toBe(result)
  })

  test(create, () => {
    const ref = { name: "jason" }
    const schema = create((context: { name: string }) => context.name)
    const result = apply(schema, ref)
    expect(result).toBe(ref.name)
  })

  describe(derive, () => {
    test(create, () => {
      const ref = { name: "jason" }
      const schema1 = create((context: { name: string }) => context.name)
      const schema = derive(schema1, (name) =>
        name.split("").reverse().join("")
      )
      const result = apply(schema, ref)
      expect(result).toBe("nosaj")
    })

    test(context, () => {
      const ref = { name: "jason" }
      const schema1 = context<{ name: string }>()
      const schema = derive(schema1, (context) =>
        context.name.split("").reverse().join("")
      )
      const result = apply(schema, ref)
      expect(result).toBe("nosaj")
    })
  })
})
