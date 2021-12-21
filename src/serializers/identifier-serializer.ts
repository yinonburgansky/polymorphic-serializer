import { classToFunction } from "../utils/class-to-function"
import { PrimitiveSerializer } from "./primitive-serializer"
import { DeserializerParams } from "./serializer"

export const IDENTIFIERS_KEY = "IDENTIFIERS_KEY"

export class IdentifierSerializer extends PrimitiveSerializer {
  deserialize(params: DeserializerParams): void {
    const map = params.context.getDefault(IDENTIFIERS_KEY, new Map())
    map.set(params.obj, params.parent)
    super.deserialize(params)
  }
}

export const identifier = classToFunction(IdentifierSerializer)
