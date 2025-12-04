import * as v from "valibot"

export interface DeriveSchema<TContext, TOutput>
  extends v.BaseSchema<TContext, TOutput, v.BaseIssue<unknown>> {
  readonly type: "GrafnDerive"
  readonly input: v.BaseSchema<TContext, TOutput, v.BaseIssue<unknown>>
  readonly fn: (input: unknown) => TOutput
}

export function derive<
  TContext,
  TInputSchema extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
  TOutput
>(
  // todo: infer the output type
  input: TInputSchema,
  fn: (input: v.InferOutput<TInputSchema>) => TOutput
): DeriveSchema<TContext, TOutput> {
  return {
    async: false,
    expects: "",
    fn,
    input,
    kind: "schema",
    reference: derive,
    type: "GrafnDerive"
  } as never
}
