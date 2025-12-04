import * as v from "valibot"

export interface CreateSchema<TContext, TOutput>
  extends v.BaseSchema<TContext, TOutput, v.BaseIssue<unknown>> {
  readonly type: "GrafnCreate"
  readonly fn: (context: TContext) => TOutput
}

export function create<TContext, TOutput>(
  fn: (context: TContext) => TOutput
): CreateSchema<TContext, TOutput> {
  return {
    async: false,
    expects: "",
    kind: "schema",
    reference: create,
    type: "GrafnCreate",
    fn
  } as never
}
