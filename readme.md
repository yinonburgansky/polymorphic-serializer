# Polymorphic Serializer

serialize and deserialize objects.
first class support for OOP and polymorphism.

based on the great declarative api of [serializr](http://github.com/mobx/serializr),
with the following key differences:

- All class serializers are stored in a centralized container instead of being stored in the class itself.
- OOP, all serializers are classes inheriting from the base class `Serializer`.
- Serializers use callbacks to set the value instead of returning it, which allow late assignment of values.

overall the actual usage is very similar to [serializr](http://github.com/mobx/serializr).

## Usage
