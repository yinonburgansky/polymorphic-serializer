import "reflect-metadata"
import { SerializationContainer } from "./serialization-container"
import { ArraySerializer } from "./serializers/array-serializer"
import { ClassSerializer } from "./serializers/class-serializer"
import { EventfulSerializer } from "./serializers/eventful-serializer"
import { IdentifierSerializer } from "./serializers/identifier-serializer"
import { MapSerializer } from "./serializers/map-serializer"
import { NullableSerializer } from "./serializers/nullable-serializer"
import { PolymorphicSerializer } from "./serializers/polymorphic-serializer"
import { PrimitiveSerializer } from "./serializers/primitive-serializer"
import { PropertySerializer } from "./serializers/property-serializer"
import { ReferenceSerializer } from "./serializers/reference-serializer"

export const container = new SerializationContainer()
export const serialize = container.serialize
export const deserialize = container.deserialize
export const serializable = container.serializable
export const serializableClass = container.serializableClass

interface IClass<T, P extends Array<unknown>> {
  new (...args: P): T
}

const methodFactory =
  <T, P extends Array<unknown>>(ctor: IClass<T, P>) =>
  (...args: P): T =>
    new ctor(...args)

export const primitive = methodFactory(PrimitiveSerializer)
export const classM = methodFactory(ClassSerializer)
export const polymorphic = methodFactory(PolymorphicSerializer)
export const map = methodFactory(MapSerializer)
export const array = methodFactory(ArraySerializer)
export const reference = methodFactory(ReferenceSerializer)
export const identifier = methodFactory(IdentifierSerializer)
export const nullable = methodFactory(NullableSerializer)
export const eventful = methodFactory(EventfulSerializer)
export const property = methodFactory(PropertySerializer)
