import { classToFunction } from "../utils/class-to-function"
import { DeserializerParams, Serializer, SerializerParams } from "./serializer"

interface IPropertySerializer {
  /** getter function name */
  getterName?: string
  /** setter function name */
  setterName?: string
}

export class PropertySerializer extends Serializer {
  constructor(
    public itemSerializer: Serializer,
    public options: IPropertySerializer
  ) {
    super()
  }

  serialize(params: SerializerParams): void {
    const { getterName } = this.options
    if (getterName) {
      const parent: any = params.parent
      if (!parent)
        throw new Error(
          `property(${getterName}) expected a parent, but received ${parent}`
        )
      params.obj = parent[getterName]()
    }
    this.itemSerializer.serialize(params)
  }

  deserialize(params: DeserializerParams): void {
    const { setterName } = this.options
    if (setterName) {
      const parent: any = params.parent
      if (!parent)
        throw new Error(
          `property(${setterName}) expected a parent, but received ${parent}`
        )

      params.setSelf = (obj) => {
        parent[setterName](obj)
      }
    }
    this.itemSerializer.deserialize(params)
  }
}

export const property = classToFunction(PropertySerializer)
