import { DeserializerParams, Serializer, SerializerParams } from "./serializer"

interface IEventfulSerializer {
  /** should not call setSelf */
  beforeSerialize?: (params: SerializerParams) => void
  /** should call setSelf  */
  afterSerialize?: (params: SerializerParams) => void
  /** should not call setSelf */
  beforeDeserialize?: (params: DeserializerParams) => void
  /** should call setSelf */
  afterDeserialize?: (params: DeserializerParams) => void
}

export class EventfulSerializer extends Serializer {
  constructor(
    public itemSerializer: Serializer,
    public options: IEventfulSerializer
  ) {
    super()
  }

  serialize(params: SerializerParams): void {
    const { beforeSerialize, afterSerialize } = this.options
    if (beforeSerialize) beforeSerialize(params)
    if (afterSerialize)
      params.setSelf = (obj) => {
        params.obj = obj
        afterSerialize(params)
      }
    this.itemSerializer.serialize(params)
  }

  deserialize(params: DeserializerParams): void {
    const { beforeDeserialize, afterDeserialize } = this.options
    if (beforeDeserialize) beforeDeserialize(params)
    if (afterDeserialize)
      params.setSelf = (obj) => {
        params.obj = obj
        afterDeserialize(params)
      }
    this.itemSerializer.deserialize(params)
  }
}
