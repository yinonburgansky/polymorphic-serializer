import { IdentifierSerializer, IDENTIFIERS_KEY } from "./identifier-serializer"
import { DeserializerParams, Serializer, SerializerParams } from "./serializer"

export class ReferenceSerializer extends Serializer {
  serialize({ obj, setSelf, context }: SerializerParams): void {
    const [classSerializer, className] =
      context.container.getSerializerOfInstanceOrError(obj as any)
    const identifiers = Array.from(classSerializer.properties.entries()).filter(
      ([, serializer]) => serializer instanceof IdentifierSerializer
    )
    if (identifiers.length !== 1) {
      throw new Error(
        `Reference Serializer could not find identifier for class ${className}, length ${identifiers.length}`
      )
    }

    const [key, serializer] = identifiers[0]
    serializer.serialize({ obj: (obj as any)[key], context, setSelf })
  }
  deserialize({ obj, setSelf, context }: DeserializerParams): void {
    context.onceSerializationDone((context) => {
      if (!context.map.get(IDENTIFIERS_KEY)?.has(obj))
        throw new Error(`Could not find identifier ${obj}`)

      setSelf(context.map.get(IDENTIFIERS_KEY)?.get(obj))
    })
  }
}
