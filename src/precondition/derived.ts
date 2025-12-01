import { InferOutput } from "./compile"
import { CreatedKindWithContexts } from "./create"
import { ContextsKind } from "./types"

export const DERIVED = Symbol("DERIVED")
export type DERIVED = typeof DERIVED

export interface Derived<
  Contexts extends ContextsKind,
  Output,
  Dependencies extends DependenciesKindWithContexts<Contexts>
> {
  (...args: DerivedFnArgs<Contexts, Dependencies>): Output
  dependencies: Dependencies
  type: DERIVED
  id: symbol
}

export type DerivedFnArgs<
  Contexts extends ContextsKind,
  Dependencies extends DependenciesKindWithContexts<Contexts>
> = [
  ...dependencies: { [P in keyof Dependencies]: InferOutput<Dependencies[P]> },
  ...contexts: Contexts
]

export type DependenciesKindWithContexts<Contexts extends ContextsKind> = [
  CreatedKindWithContexts<Contexts> | DerivedKindWithContexts<Contexts>,
  ...Array<
    CreatedKindWithContexts<Contexts> | DerivedKindWithContexts<Contexts>
  >
]

export type DerivedKindWithContexts<Contexts extends ContextsKind> = Derived<
  Contexts,
  unknown,
  DependenciesKindWithContexts<Contexts>
>

export type DerivedKind = DerivedKindWithContexts<ContextsKind>

export function createDerived<Contexts extends ContextsKind>() {
  return function derive<
    Dependencies extends DependenciesKindWithContexts<Contexts>,
    Output
  >(
    ...args: [
      ...dependencies: Dependencies,
      fn: (...args: DerivedFnArgs<Contexts, Dependencies>) => Output
    ]
  ): Derived<Contexts, Output, Dependencies> {
    const dependencies = args.slice(0, args.length - 1) as Dependencies

    const fn = args[args.length - 1] as (
      ...args: DerivedFnArgs<Contexts, Dependencies>
    ) => Output

    function derive(...args: DerivedFnArgs<Contexts, Dependencies>) {
      return fn(...args)
    }

    derive.type = DERIVED
    derive.id = Symbol()
    derive.dependencies = dependencies

    return derive
  }
}
