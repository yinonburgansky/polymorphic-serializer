import { PrimitiveSerializer } from './PrimitiveSerializer'
import { DeserializerParams } from './Serializer'

export const IDENTIFIERS_KEY = 'IDENTIFIERS_KEY'

export class IdentifierSerializer extends PrimitiveSerializer {
  deserialize(params: DeserializerParams): void {
    const map = params.context.getDefault(IDENTIFIERS_KEY, new Map())
    map.set(params.obj, params.parent)
    super.deserialize(params)
  }
}
