import { ConditionalKind, ConditionalKindWithContexts } from "./conditional"
import { CreatedKind, CreatedKindWithContexts } from "./create"
import { DerivedKind, DerivedKindWithContexts } from "./derived"
import { StructKind, StructKindWithContexts } from "./struct"

export type SchemaKind =
  | CreatedKind
  | DerivedKind
  | ConditionalKind
  | StructKind

export type SchemaKindWithContexts<Contexts extends ContextsKind> =
  | CreatedKindWithContexts<Contexts>
  | DerivedKindWithContexts<Contexts>
  | ConditionalKindWithContexts<Contexts>
  | StructKindWithContexts<Contexts>

export type ContextsKind = ReadonlyArray<unknown>
