import test from 'ava';
import { transformAnyValuesDeep, transformValuesDeep } from '../src/index';
test('string to number', t => {
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
  const expected = {
    a: 4,
    b: {
      c: 7,
      f: foo,
    },
    d: 9,
  };
  t.deepEqual(actual, expected);
});
test('no change object', t => {
  const o = {};
  t.not(
    transformValuesDeep({ foo: o }, v => v),
    { foo: o }
  );
});
test('array', t => {
  t.deepEqual(
    transformValuesDeep([1, 2], o => o),
    [1, 2]
  );
});
test('array in object', t => {
  const actual = transformAnyValuesDeep(
    {
      foo: [4, '3', { a: 7 }],
      bar: '9',
    },
    (num: number) => num.toString(),
    (o): o is number => typeof o === 'number'
  );
  const expected = {
    foo: ['4', '3', { a: '7' }],
    bar: '9',
  };
  t.deepEqual(actual, expected);
});
