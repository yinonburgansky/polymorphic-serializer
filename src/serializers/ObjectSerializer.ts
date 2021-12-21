import { SerializationContext } from "../SerializationContext"
import { NullableSerializer } from "./NullableSerializer"
import { DeserializerParams, Serializer, SerializerParams } from "./Serializer"

export class ObjectSerializer<T> extends Serializer {
  constructor(
    public properties: Map<keyof T & string, Serializer> = new Map()
  ) {
    super()
  }

  serialize({ obj, setSelf, context }: SerializerParams): void {
    if (!this.isObject(obj))
      throw new Error(`Expected object but received ${obj}`)
    const result: Record<string, unknown> = {}
    this.serializeExisting(obj, result, context)
    setSelf(result)
  }

  serializeExisting(
    obj: Record<string, unknown>,
    result: Record<string, unknown>,
    context: SerializationContext
  ): void {
    for (const [propertyKey, propertySerializer] of this.properties) {
      if (!(propertyKey in obj)) {
        console.error(`Could not find property ${propertyKey} in ${obj}`)
        continue
      }

      propertySerializer.serialize({
        obj: obj[propertyKey],
        parent: result,
        setSelf: (val) => (result[propertyKey] = val),
        context,
      })
    }
  }

  deserialize({ obj, setSelf, context }: DeserializerParams): void {
    if (!this.isObject(obj))
      throw new Error(`Expected Object, but received ${obj}`)
    const result: Record<string, unknown> = {}
    this.deserializeExisting(obj, result, context)
    setSelf(result)
  }

  deserializeExisting(
    obj: Record<string, unknown>,
    result: Record<string, unknown>,
    context: SerializationContext
  ): void {
    for (const [propertyKey, propertySerializer] of this.properties) {
      if (
        !(propertyKey in obj) &&
        !(propertySerializer instanceof NullableSerializer)
      ) {
        console.error(
          `Could not find property '${propertyKey}' in '${obj}'`,
          obj
        )
        continue
      }

      propertySerializer.deserialize({
        obj: obj[propertyKey],
        oldObj: result[propertyKey],
        parent: result,
        setSelf: (val) => (result[propertyKey] = val),
        context,
      })
    }
  }

  isObject(obj: unknown): obj is Record<string, unknown> {
    return obj instanceof Object
  }
}
