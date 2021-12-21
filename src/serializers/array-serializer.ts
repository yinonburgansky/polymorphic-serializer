import { DeserializerParams, Serializer, SerializerParams } from "./serializer"

export class ArraySerializer extends Serializer {
  constructor(public itemSerializer: Serializer) {
    super()
  }

  serialize({ obj, setSelf, context }: SerializerParams): void {
    if (!this.isArray(obj))
      throw new Error(`Expected a list  but received ${obj}`)
    const result: unknown[] = []
    obj.forEach((item, index) =>
      this.itemSerializer.serialize({
        obj: item,
        parent: result,
        setSelf: (val) => (result[index] = val),
        context,
      })
    )
    setSelf(result)
  }

  deserialize({ obj, oldObj, setSelf, context }: DeserializerParams): void {
    if (!this.isArray(obj))
      throw new Error(`Expected a list but received ${obj}`)
    let result: unknown[] = []
    if (this.isArray(oldObj)) {
      result = oldObj
    }
    obj.forEach((item, index) =>
      this.itemSerializer.deserialize({
        obj: item,
        parent: result,
        setSelf: (val) => (result[index] = val),
        context,
      })
    )
    setSelf(result)
  }

  isArray(obj: unknown): obj is Array<unknown> {
    return obj instanceof Array
  }
}
