import * as v from "valibot"

export interface ConditionalSchema<TContext, TOutput>
  extends v.BaseSchema<TContext, TOutput, v.BaseIssue<unknown>> {
  readonly type: "GrafnConditional"
  readonly condition: boolean
  readonly input: v.BaseSchema<TContext, TOutput, v.BaseIssue<unknown>>
}

export function conditional<TContext, TCondition extends boolean, TOutput>(
  condition: TCondition,
  input: v.BaseSchema<TContext, TOutput, v.BaseIssue<unknown>>
): ConditionalSchema<TContext, TOutput> {
  return {
    async: false,
    expects: "",
    condition,
    input,
    kind: "schema",
    reference: conditional,
    type: "GrafnConditional"
  } as never
}
