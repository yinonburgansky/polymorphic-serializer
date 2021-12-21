import { DeserializerParams, Serializer, SerializerParams } from './Serializer'

export class PrimitiveSerializer extends Serializer {
  serialize({ obj, setSelf }: SerializerParams): void {
    setSelf(obj)
  }
  deserialize({ obj, setSelf }: DeserializerParams): void {
    setSelf(obj)
  }
}
