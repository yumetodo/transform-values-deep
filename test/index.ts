import test from 'ava';
import { transformAnyValuesDeep, transformValuesDeep } from '../src/index';
test('string to number', t => {
  const foo = () => true;
  t.deepEqual(
    {
      a: 4,
      b: {
        c: 7,
        f: foo,
      },
      d: 9,
    },
    transformAnyValuesDeep(
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
    )
  );
});
test('no change object', t => {
  const o = {};
  t.not(
    { foo: o },
    transformValuesDeep({ foo: o }, v => v)
  );
});
