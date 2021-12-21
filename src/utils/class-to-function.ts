interface IClass<T, P extends Array<unknown>> {
  new (...args: P): T
}

// converts a class to a constructor function
export const classToFunction =
  <T, P extends Array<unknown>>(ctor: IClass<T, P>) =>
  (...args: P): T =>
    new ctor(...args)
