import { createCompile } from "./compile"
import { createConditional } from "./conditional"
import { createCreate } from "./create"
import { createDerived } from "./derived"
import { createStruct } from "./struct"

export function createOptions<Contexts extends Array<unknown>>() {
  return {
    create: createCreate<Contexts>(),
    derive: createDerived<Contexts>(),
    conditional: createConditional<Contexts>(),
    struct: createStruct<Contexts>(),
    compile: createCompile<Contexts>()
  }
}
