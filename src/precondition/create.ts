import { ContextsKind } from "./types"

export interface Created<Contexts extends ContextsKind, Output> {
  fn(...contexts: Contexts): Output
  type: "CREATED"
  id: symbol
}

export type CreatedKindWithContexts<Contexts extends ContextsKind> = Created<
  Contexts,
  unknown
>

export type CreatedKind = CreatedKindWithContexts<ContextsKind>

export function createCreate<Contexts extends ContextsKind>() {
  return function create<Output>(
    fn: (...contexts: Contexts) => Output
  ): Created<Contexts, Output> {
    return {
      fn,
      type: "CREATED",
      id: Symbol()
    }
  }
}
