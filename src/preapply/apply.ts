import * as v from "valibot"
import { CreateSchema } from "./create"
import { ContextSchema } from "./context"
import { ConditionalSchema } from "./conditional"
import { DeriveSchema } from "./derive"

export type NodeKey = v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>

export type Node = unknown

export type FunctionExpressionReferenceSchema<TContext> =
  | CreateSchema<TContext, unknown>
  | ContextSchema<TContext>
  | ConditionalSchema<TContext, unknown>
  | DeriveSchema<TContext, unknown>

// todo: traverse types and check to see if leaf is one of our types.
export type CompilableSchema<TContext> =
  | FunctionExpressionReferenceSchema<TContext>
  | v.ObjectSchema<v.ObjectEntries, v.ErrorMessage<v.BaseIssue<unknown>>>
  | v.TupleSchema<v.TupleItems, v.ErrorMessage<v.TupleIssue>>

export function apply<TCompilableSchema extends CompilableSchema<any>>(
  compilable: TCompilableSchema,
  context: v.InferInput<TCompilableSchema>
): v.InferOutput<TCompilableSchema> {
  // value is object, array or literal value.
  const cache = new Map<NodeKey, Node>()

  // ensure the item is in the cache
  function hit(key: NodeKey, onMiss: () => Node) {
    if (!cache.has(key)) {
      cache.set(key, onMiss())
    }

    return cache.get(key)!
  }

  // Same as `walk` but widens the type
  function stride(base: v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>) {
    return walk(base as never)
  }

  // Indicates whether we used the context for the function.
  let rooted = false

  // call and cache
  // whatever value I return is now in the cache.
  function walk(schema: CompilableSchema<unknown>): Node {
    switch (schema.type) {
      case "GrafnContext": {
        rooted = true
        return context
      }
      case "GrafnCreate": {
        rooted = true
        return hit(schema, () => schema.fn(context))
      }
      case "GrafnDerive": {
        const input = stride(schema.input)
        return hit(schema, () => schema.fn(input))
      }
      case "GrafnConditional": {
        if (schema.condition) {
          return stride(schema.input)
        } else {
          return
        }
      }
      case "object": {
        return hit(schema, () => {
          const object: Record<string, unknown> = {}

          for (const property in schema.entries) {
            const entry = schema.entries[property]

            const value = stride(entry)

            object[property] = value
          }
          return object
        })
      }
      case "tuple": {
        return hit(schema, () => {
          const tuple: Array<unknown> = []

          for (const item of schema.items) {
            const value = stride(item)

            tuple.push(value)
          }
          return tuple
        })
      }
      default: {
        //@ts-expect-error
        throw new Error(schema.type)
      }
    }
  }

  const root = walk(compilable)

  if (!rooted) {
    throw new Error(
      "Expected context to be consumed when resulting the function graph"
    )
  }

  return root
}

// todo: walk the type tree so we
