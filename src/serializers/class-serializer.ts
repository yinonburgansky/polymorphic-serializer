import { constructor } from "../serialization-container"
import { SerializationContext } from "../serialization-context"
import { classToFunction } from "../utils/class-to-function"
import { ObjectSerializer } from "./object-serializer"
import { DeserializerParams, Serializer, SerializerParams } from "./serializer"

export class ClassSerializer<T> extends ObjectSerializer<T> {
  constructor(
    public classTarget: constructor<T>,
    public properties: Map<keyof T & string, Serializer> = new Map()
  ) {
    super(properties)
  }

  serialize(params: SerializerParams): void {
    this.validateClass(params.obj)
    super.serialize(params)
  }

  serializeExisting(
    obj: Record<string, unknown>,
    result: Record<string, unknown>,
    context: SerializationContext
  ): void {
    this.validateClass(obj)
    super.serializeExisting(obj, result, context)
  }

  deserialize({ obj, setSelf, context }: DeserializerParams): void {
    const result = context.container.resolveInstanceOrError<T>(this.classTarget)
    super.deserializeExisting(
      obj as Record<string, unknown>,
      result as Record<string, unknown>,
      context
    )
    setSelf(result)
  }

  validateClass(obj: unknown): void {
    if (!this.isClass(obj))
      throw new Error(
        `Expected class ${this.classTarget.name} but received ${obj}`
      )
  }

  isClass(obj: unknown): obj is T {
    return obj instanceof this.classTarget
  }
}

export const classM = classToFunction(ClassSerializer)
