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
import { classToFunction } from "./utils/class-to-function"

export const container = new SerializationContainer()
export const serialize = container.serialize
export const deserialize = container.deserialize
export const serializable = container.serializable
export const serializableClass = container.serializableClass

export * from "./serializers"
