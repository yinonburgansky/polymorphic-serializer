import { classToFunction } from "../utils/class-to-function"
import { DeserializerParams, Serializer, SerializerParams } from "./serializer"

export class MapSerializer extends Serializer {
  constructor(public itemSchema: Serializer) {
    super()
  }
  serialize({ obj, setSelf, context }: SerializerParams): void {
    const result: Record<any, any> = {}
    if (!this.isMap(obj))
      throw new Error(`Map serializer expected a map, received ${obj}`)
    obj.forEach((value, key) =>
      this.itemSchema.serialize({
        obj: value,
        parent: result,
        context,
        setSelf: (val) => (result[key as any] = val),
      })
    )
    setSelf(result)
  }

  deserialize({ obj, oldObj, setSelf, context }: DeserializerParams): void {
    if (this.isJsonObject(obj))
      throw new Error(`Map serializer Expected JSON object, received ${obj}`)
    let result: Record<any, any> = {}
    if (this.isMap(oldObj)) {
      oldObj.clear()
      result = oldObj
    }
    for (const key in obj as any) {
      this.itemSchema.deserialize({
        obj: obj[key],
        context,
        setSelf: (val) => result.set(key, val),
      })
    }
    setSelf(result)
  }

  private isJsonObject(obj: unknown): obj is any {
    return !obj || typeof obj !== "object"
  }

  isMap(obj: any): obj is InstanceType<typeof Map> {
    return obj instanceof Map || (obj && obj.forEach && obj.set)
  }
}

export const map = classToFunction(MapSerializer)
