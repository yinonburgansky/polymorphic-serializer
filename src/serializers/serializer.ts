import { SerializationContext } from "../serialization-context"

type SetSelf = (obj: unknown) => void

export interface SerializerParams {
  parent?: unknown
  obj: unknown
  setSelf: SetSelf
  context: SerializationContext
}

export interface DeserializerParams {
  obj: unknown
  oldObj?: unknown
  parent?: unknown
  setSelf: SetSelf
  context: SerializationContext
}

export abstract class Serializer {
  public abstract serialize(params: SerializerParams): void
  public abstract deserialize(params: DeserializerParams): void
}
