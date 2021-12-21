import "reflect-metadata"
import { SerializationContainer } from "./SerializationContainer"
import { ArraySerializer } from "./serializers/ArraySerializer"
import { ClassSerializer } from "./serializers/ClassSerializer"
import { EventfulSerializer } from "./serializers/EventfulSerializer"
import { IdentifierSerializer } from "./serializers/IdentifierSerializer"
import { MapSerializer } from "./serializers/MapSerializer"
import { NullableSerializer } from "./serializers/NullableSerializer"
import { PolymorphicSerializer } from "./serializers/PolymorphicSerializer"
import { PrimitiveSerializer } from "./serializers/PrimitiveSerializer"
import { PropertySerializer } from "./serializers/PropertySerializer"
import { ReferenceSerializer } from "./serializers/ReferenceSerializer"

export const serializer = new SerializationContainer()
export const serialize = serializer.serialize
export const deserialize = serializer.deserialize
export const serializable = serializer.serializable
export const serializableClass = serializer.serializableClass
export const setClassFactory = serializer.setClassFactory

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
