import { DeserializerParams, Serializer, SerializerParams } from "./serializer"

export class NullableSerializer extends Serializer {
  constructor(public itemSerializer: Serializer) {
    super()
  }

  serialize(params: SerializerParams): void {
    const { obj, setSelf } = params
    if (typeof obj === undefined)
      throw new Error("nullable serializer should not get undefined")
    if (obj === null) {
      setSelf(null)
    } else {
      this.itemSerializer.serialize(params)
    }
  }

  deserialize(params: DeserializerParams): void {
    const { obj, setSelf } = params
    if (typeof obj === undefined)
      throw new Error("nullable serializer should not get undefined")
    if (obj === null) {
      setSelf(null)
    } else {
      this.itemSerializer.deserialize(params)
    }
  }
}
