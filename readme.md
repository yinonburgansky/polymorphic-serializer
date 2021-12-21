# Polymorphic Serializer

serialize and deserialize objects.
first class support for OOP and polymorphism.

based on the great declarative api of [serializr](http://github.com/mobx/serializr),
with the following key differences:

- All class serializers are stored in a centralized container instead of being stored in the class itself.
- OOP, all serializers are classes inheriting from the base class `Serializer`.
- Serializers use callbacks to set the value instead of returning it, which allow late assignment of values.

overall the actual usage is very similar to [serializr](http://github.com/mobx/serializr).

## Installation

`npm install polymorphic-serializer`

or

`yarn add polymorphic-serializer`

make sure to enable decorators support in your `tsconfig.json` file:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    ...
  }
  ...
}
```

## Usage

```typescript
import {
  array,
  deserialize,
  polymorphic,
  primitive,
  serializable,
  serialize,
} from "polymorphic-serializer"

abstract class Shape {
  @serializable(primitive())
  color = "red"

  abstract area(): number
}

class Circle extends Shape {
  @serializable(primitive())
  radius = 1

  area(): number {
    return Math.PI * this.radius * this.radius
  }
}

class Rectangle extends Shape {
  @serializable(primitive())
  width = 1
  @serializable(primitive())
  height = 1

  area(): number {
    return this.width * this.height
  }
}

class Board {
  @serializable(array(polymorphic()))
  shapes: Shape[] = []
}

const board = new Board()
board.shapes.push(new Circle())
board.shapes.push(new Rectangle())

const serializedObj = serialize(board, polymorphic())

console.log(serializedObj)
/* plain js object:
{
  className: 'Board',
  shapes: [
    { className: 'Circle', color: 'red', radius: 1 },
    { className: 'Rectangle', color: 'red', width: 1, height: 1 }
  ]
} */

// which can be stringified to JSON be parsed again
const json = JSON.stringify(serializedObj)
const parsed = JSON.parse(json)

const boardDeserialized = deserialize(parsed, polymorphic()) as Board

console.log(boardDeserialized instanceof Board) // true
console.log(boardDeserialized.shapes[0] instanceof Circle) // true
console.log(boardDeserialized.shapes[1] instanceof Rectangle) // true

console.log(boardDeserialized.shapes[0].area()) // 3.141592653589793
console.log(boardDeserialized.shapes[1].area()) // 1
```
