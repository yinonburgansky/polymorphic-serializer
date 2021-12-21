import { polymorphic, primitive } from "."
import { SerializationContext } from "./SerializationContext"
import { ClassSerializer } from "./serializers/ClassSerializer"
import { Serializer } from "./serializers/Serializer"

export type constructor<T> = {
  new (...args: any[]): T
}
export class SerializationContainer {
  map = new Map<string, ClassSerializer<any>>()

  reset(): void {
    this.map.clear()
  }

  resolveInstance = <T>(classTarget: constructor<T>): T => {
    return new classTarget()
  }

  resolveInstanceOrError = <T>(classTarget: constructor<T>): T => {
    const result = this.resolveInstance(classTarget)
    if (!result) {
      throw new Error(`Could not instantiate class ${classTarget.name}`)
    }
    return result
  }

  setClassFactory = (resolveInstance: <T>(classTarget: constructor<T>) => T): void => {
    this.resolveInstance = resolveInstance
  }

  getSerializer<T>(key: string): ClassSerializer<T> | undefined {
    return this.map.get(key)
  }

  getSerializerOrError<T>(key: string): ClassSerializer<T> {
    const serializer = this.getSerializer<T>(key)
    if (!serializer) throw new Error(`Could not find serializer for ${key}`)

    return serializer
  }

  getSerializerOfClass<T>(
    target: constructor<T>
  ): [ClassSerializer<T>, string] | undefined {
    const className = target.name
    if (!className) return
    const serializer = this.getSerializer<T>(className)
    if (!serializer) return
    return [serializer, className]
  }

  getSerializerOfClassOrError<T>(target: constructor<T>): [ClassSerializer<T>, string] {
    const serializer = this.getSerializerOfClass<T>(target)
    if (!serializer) throw new Error(`Could not find serializer for class ${target.name}`)
    return serializer
  }

  getSerializerOfInstanceOrError<T extends constructor<any>>(
    instance: InstanceType<T>
  ): [ClassSerializer<T>, string] {
    let serializer
    if (instance && instance?.constructor)
      serializer = this.getSerializerOfClass<T>(instance.constructor)
    if (!serializer)
      throw new Error(
        `Could not find serializer for instance ${instance} of class ${instance.constructor.name}`
      )
    return serializer
  }

  private get defaultSerializationContext() {
    return new SerializationContext(this)
  }

  serialize = (obj: any, objSerializer: Serializer = polymorphic()): string => {
    const context = this.defaultSerializationContext
    const result: any = []
    objSerializer.serialize({
      obj,
      context,
      setSelf: (val) => (result[0] = val),
    })
    context.emitSerializationDone()
    return result[0]
  }

  deserialize = <T>(json: any, targetSerializer: Serializer = polymorphic()): T => {
    const obj = json
    const context = this.defaultSerializationContext
    const result: any = []
    targetSerializer.deserialize({
      obj,
      context,
      setSelf: (val) => (result[0] = val),
    })
    context.emitSerializationDone()
    return result[0]
  }

  serializable = (serializer: Serializer = primitive()): PropertyDecorator => {
    // target is class prototype
    return (target, propertyKey): void => {
      if (typeof propertyKey !== "string")
        throw new Error(
          `Invalid serializable property ${propertyKey.toString()} on class ${
            target.constructor.name
          }`
        )

      const classSerializer = this.getDefaultClassSerializer(target.constructor)
      classSerializer.properties.set(propertyKey, serializer)
    }
  }

  /**
   * register a class as serializable
   * if it doesn't have any direct serializable properties
   * @returns class decorator
   */
  serializableClass = (): ClassDecorator => {
    // target is class constructor
    return (target): void => {
      this.getDefaultClassSerializer(target)
    }
  }

  protected getDefaultClassSerializer(target: any): ClassSerializer<any> {
    const key = target.name
    let targetSerializer = this.map.get(key)
    if (targetSerializer) return targetSerializer
    let baseSerializer = undefined
    if (target.__proto__.name)
      baseSerializer = this.getDefaultClassSerializer(target.__proto__)
    targetSerializer = new ClassSerializer(
      target,
      new Map(baseSerializer?.properties.entries() || [])
    )
    this.map.set(key, targetSerializer)
    return targetSerializer
  }
}
