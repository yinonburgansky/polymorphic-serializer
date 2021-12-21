import { EventEmitter } from "events"
import { SerializationContainer } from "./SerializationContainer"

export class SerializationContext {
  constructor(
    public container: SerializationContainer,
    public map = new Map(),
    public eventEmitter = new EventEmitter()
  ) {
    eventEmitter.setMaxListeners(0)
  }

  getDefault<T>(key: any, defaultValue: T): T {
    if (this.map.has(key)) return this.map.get(key)
    this.map.set(key, defaultValue)
    return defaultValue
  }

  once(
    event: string | symbol,
    callback: (context: SerializationContext, ...args: any[]) => void
  ): void {
    this.eventEmitter.once(event, callback)
  }

  emit(event: string | symbol, ...args: any[]): void {
    this.eventEmitter.emit(event, this, ...args)
  }

  SERIALIZATION_DONE = "SERIALIZATION_DONE"

  onceSerializationDone(
    callback: (context: SerializationContext, ...args: any[]) => void
  ): void {
    this.once(this.SERIALIZATION_DONE, callback)
  }

  emitSerializationDone(): void {
    this.emit(this.SERIALIZATION_DONE)
  }
}
