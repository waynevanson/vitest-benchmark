import { CreatedKindWithContexts, Created } from "./create"
import { DerivedKindWithContexts, Derived, DependenciesKind } from "./derived"
import { ContextsKind } from "./types"

export const CONDITIONAL = Symbol("CONDITIONAL")
export type CONDITIONAL = typeof CONDITIONAL

export interface Conditional<
  Contexts extends ContextsKind,
  Condition extends boolean,
  Fn extends
    | CreatedKindWithContexts<Contexts>
    | DerivedKindWithContexts<Contexts>
> {
  (...args: Parameters<Fn>): ReturnType<Fn>
  condition: Condition
  type: CONDITIONAL
  id: symbol
  fn: Fn
}

export type ConditionalFnKindWithContexts<Contexts extends ContextsKind> =
  | CreatedKindWithContexts<Contexts>
  | DerivedKindWithContexts<ContextsKind>

export type ConditionalFnKind = ConditionalFnKindWithContexts<ContextsKind>

export type ConditionalKindWithContexts<Contexts extends ContextsKind> =
  Conditional<Contexts, boolean, ConditionalFnKindWithContexts<Contexts>>

export type ConditionalKind = ConditionalKindWithContexts<ContextsKind>

export function createConditional<Contexts extends ContextsKind>() {
  return function conditional<
    Condition extends boolean,
    Fn extends
      | CreatedKindWithContexts<Contexts>
      | DerivedKindWithContexts<Contexts>
  >(condition: Condition, fn: Fn): Conditional<Contexts, Condition, Fn> {
    function conditional(...args: Parameters<Fn>): ReturnType<Fn> {
      //@ts-expect-error
      return fn(...args)
    }

    conditional.type = CONDITIONAL
    conditional.condition = condition
    conditional.fn = fn
    conditional.id = fn.id

    return conditional
  }
}
