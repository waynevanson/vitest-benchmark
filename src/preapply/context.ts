import * as v from "valibot"

export interface ContextSchema<TContext>
  extends v.BaseSchema<TContext, TContext, v.BaseIssue<unknown>> {
  readonly type: "GrafnContext"
}

export function context<TContext>(): ContextSchema<TContext> {
  return {
    async: false,
    expects: "",
    kind: "schema",
    reference: context,
    type: "GrafnContext"
  } as never
}
