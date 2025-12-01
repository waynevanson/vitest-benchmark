import { Created } from "./create"
import { ContextsKind } from "./types"

export const DERIVED = Symbol("DERIVED")
export type DERIVED = typeof DERIVED

export interface Derived<
  Contexts extends ContextsKind,
  Output,
  Dependencies extends DependenciesKind
> {
  (...args: DerivedFnArgs<Contexts, Dependencies>): Output
  deps: DerivedDeps<Contexts, Dependencies>
  type: DERIVED
  id: symbol
}

export type DerivedDeps<
  Contexts extends ContextsKind,
  Dependencies extends DependenciesKind
> = {
  [P in keyof Dependencies]: Created<Contexts, Dependencies[P]>
}

export type DerivedFnArgs<
  Contexts extends ContextsKind,
  Dependencies extends DependenciesKind
> = [...Dependencies: Dependencies, ...contexts: Contexts]

export type DependenciesKind = ReadonlyArray<unknown>

export type DerivedKindWithContexts<Contexts extends ContextsKind> = Derived<
  Contexts,
  unknown,
  DependenciesKind
>

export type DerivedKind = DerivedKindWithContexts<ContextsKind>

export function createDerived<Contexts extends ContextsKind>() {
  return function derive<Dependencies extends ReadonlyArray<unknown>, Output>(
    ...args: [
      ...dependencies: {
        [P in keyof Dependencies]:
          | Created<Contexts, Dependencies[P]>
          | Derived<Contexts, Dependencies[P], any>
      },
      fn: (...args: DerivedFnArgs<Contexts, Dependencies>) => Output
    ]
  ): Derived<Contexts, Output, Dependencies> {
    const deps = args.slice(0, args.length - 1) as DerivedDeps<
      Contexts,
      Dependencies
    >

    const fn = args[args.length - 1] as (
      ...args: DerivedFnArgs<Contexts, Dependencies>
    ) => Output

    function derive(...args: DerivedFnArgs<Contexts, Dependencies>) {
      return fn(...args)
    }

    derive.type = DERIVED
    derive.id = Symbol()
    derive.deps = deps

    return derive
  }
}
