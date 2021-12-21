import "reflect-metadata"
import { container, injectable, singleton } from "tsyringe"
import {
  array,
  container as serializationContainer,
  deserialize,
  identifier,
  map,
  polymorphic,
  reference,
  serializable,
  serialize,
} from "../src/index"

describe("serializable", () => {
  beforeEach(() => {
    container.reset()
    serializationContainer.reset()
  })

  test("should serialize", () => {
    class Test {
      @serializable()
      id = "name"
    }
    const test = new Test()
    const serializedTest = serialize(test)
    expect(serializedTest).toEqual({
      className: "Test",
      id: "name",
    })
    const deserializedTest = deserialize(serializedTest)
    expect(deserializedTest).toEqual(test)
  })

  test("singleton", () => {
    @singleton()
    class Test {
      @serializable()
      id = "name"
    }
    const test = container.resolve(Test)
    serializationContainer.setClassFactory(container.resolve.bind(container))
    serialize(test)
    const serializedTest = serialize(test)
    expect(serializedTest).toEqual({
      className: "Test",
      id: "name",
    })
    const deserializedTest = deserialize(serializedTest)
    expect(deserializedTest).toBe(test)
  })

  test("list", () => {
    @injectable()
    class A {
      @serializable()
      id = "a"
    }
    @injectable()
    class B {
      @serializable()
      id = "b"
    }
    @injectable()
    class Test {
      @serializable()
      id = "name"

      @serializable(array(polymorphic()))
      list: any = []
    }
    const test = container.resolve(Test)
    test.id = "name2"
    test.list.push(container.resolve(A))
    test.list.push(container.resolve(B))
    const serializedTest = serialize(test)
    expect(serializedTest).toEqual({
      className: "Test",
      id: "name2",
      list: [
        { className: "A", id: "a" },
        { className: "B", id: "b" },
      ],
    })
    const deserializedTest = deserialize<Test>(serializedTest)
    expect(deserializedTest).toEqual(test)
    expect(deserializedTest).not.toBe(test)
    expect(deserializedTest.list[0]).toBeInstanceOf(A)
    expect(deserializedTest.list[1]).toBeInstanceOf(B)
  })

  test("reference", () => {
    class Base {
      @serializable(identifier())
      id = "testId"

      @serializable()
      over = "base"

      un1 = "1"
    }
    class A extends Base {
      id = "idA"

      @serializable()
      a = "test a"

      @serializable()
      over = "a"

      un1 = "2"
    }
    class B extends Base {
      id = "idB"

      @serializable()
      b = "test b"

      @serializable()
      over = "b"

      un1 = "3"
    }
    class Test {
      @serializable()
      id = "name"

      @serializable(array(polymorphic()))
      list: any = []

      @serializable(array(reference()))
      refs: any = []
    }
    const test = new Test()
    const a = new A()
    const b = new B()
    test.list.push(a)
    test.list.push(b)
    test.refs.push(a)
    test.refs.push(b)
    const serializedTest = serialize(test)
    expect(serializedTest).toEqual({
      className: "Test",
      id: "name",
      list: [
        { className: "A", id: "idA", a: "test a", over: "a" },
        { className: "B", id: "idB", b: "test b", over: "b" },
      ],
      refs: ["idA", "idB"],
    })
    const deserializedTest = deserialize<Test>(serializedTest)
    expect(deserializedTest).toEqual(test)
    expect(deserializedTest).not.toBe(test)
    expect(deserializedTest.list[0]).toBeInstanceOf(A)
    expect(deserializedTest.list[1]).toBeInstanceOf(B)
    expect(deserializedTest.refs[0]).toBeInstanceOf(A)
    expect(deserializedTest.refs[1]).toBeInstanceOf(B)
    expect(deserializedTest.list[0]).toBe(deserializedTest.refs[0])
    expect(deserializedTest.list[1]).toBe(deserializedTest.refs[1])
  })

  test("map", () => {
    serializationContainer.setClassFactory((c: any) => new c())
    class Base {
      @serializable(identifier())
      id = "testId"

      @serializable()
      over = "base"

      un1 = "1"
    }
    class A extends Base {
      id = "idA"

      @serializable()
      a = "test a"

      @serializable()
      over = "a"

      un1 = "2"
    }
    class B extends Base {
      id = "idB"

      @serializable()
      b = "test b"

      @serializable()
      over = "b"

      un1 = "3"
    }
    class Test {
      @serializable()
      id = "name"

      @serializable(map(polymorphic()))
      list: any = new Map()

      @serializable(map(reference()))
      refs: any = new Map()
    }
    const test = new Test()
    const a = new A()
    const b = new B()
    test.list.set(a.id, a)
    test.list.set(b.id, b)
    test.refs.set(a.id, a)
    test.refs.set(b.id, b)
    const serializedTest = serialize(test)
    expect(serializedTest).toEqual({
      className: "Test",
      id: "name",
      list: {
        idA: { className: "A", id: "idA", a: "test a", over: "a" },
        idB: { className: "B", id: "idB", b: "test b", over: "b" },
      },
      refs: { idA: "idA", idB: "idB" },
    })
    const deserializedTest = deserialize<Test>(serializedTest)
    expect(deserializedTest).toEqual(test)
    expect(deserializedTest).not.toBe(test)
    expect(deserializedTest.list.get("idA")).toBeInstanceOf(A)
    expect(deserializedTest.list.get("idB")).toBeInstanceOf(B)
    expect(deserializedTest.refs.get("idA")).toBeInstanceOf(A)
    expect(deserializedTest.refs.get("idB")).toBeInstanceOf(B)
    expect(deserializedTest.list.get("idA")).toBe(
      deserializedTest.refs.get("idA")
    )
    expect(deserializedTest.list.get("idB")).toBe(
      deserializedTest.refs.get("idB")
    )
  })
})
