import { DeserializerParams, Serializer, SerializerParams } from "./serializer"

export class PrimitiveSerializer extends Serializer {
  serialize({ obj, setSelf }: SerializerParams): void {
    setSelf(obj)
  }
  deserialize({ obj, setSelf }: DeserializerParams): void {
    setSelf(obj)
  }
}
