import { DeserializerParams, Serializer, SerializerParams } from "./serializer"

export class PolymorphicSerializer extends Serializer {
  serialize({ obj, setSelf, context }: SerializerParams): void {
    const [classSerializer, className] =
      context.container.getSerializerOfInstanceOrError(obj as any)
    const result = { className }
    classSerializer.serializeExisting(obj as any, result, context)
    setSelf(result)
  }
  deserialize(params: DeserializerParams): void {
    const { obj }: any = params
    if (!obj.className)
      throw new Error(`Polymorphic serializer expected className in ${obj}`)
    const className = obj.className
    const classSerializer =
      params.context.container.getSerializerOrError(className)
    classSerializer.deserialize(params)
  }
}
