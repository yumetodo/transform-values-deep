# transform-values-deep

Deeply convert object values using specified predicate.

```typescript
const foo = () => true;
const actual = transformAnyValuesDeep(
  {
    a: 4,
    b: {
      c: '7',
      f: foo,
    },
    d: '9',
  },
  (s: string) => parseInt(s),
  (o: unknown): o is string => typeof o === 'string'
);
/*
=> {
  a: 4,
  b: {
    c: 7,
    f: foo,
  },
  d: 9,
}
*/
```
