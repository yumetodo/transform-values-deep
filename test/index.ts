import test from 'ava';
import { transformAnyValuesDeep } from '../src/index';
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
    transformAnyValuesDeep<string>(
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
