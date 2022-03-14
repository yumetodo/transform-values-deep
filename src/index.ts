//"string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function"
export type TransformTargetType = string | number | bigint | boolean | symbol | undefined;
export function defaultTransformTargetType(o: unknown): o is TransformTargetType {
  return typeof o !== 'object' || typeof o !== 'function';
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isRecord(v: unknown): v is Record<any, unknown> {
  if (typeof v !== 'object') {
    return false;
  }
  return v !== null;
}

/**
 * Deeply convert object values using specified predicate
 * @param o input object
 * @param pred applied to the object value which type is not object, array or null and not rejected by `isTransformTargetType`
 * @param isTransformTargetType decide weather it should be converted or not
 * @returns converted new object
 */
export function transformAnyValuesDeep<T>(
  o: Record<string, unknown> | Array<unknown>,
  pred: (o: T) => unknown,
  isTransformTargetType: (o: unknown) => o is T
): Record<string, unknown> | Array<unknown> {
  const re: Record<string, unknown> = { ...o };
  for (const [k, v] of Object.entries(re)) {
    if (Array.isArray(v)) {
      re[k] = v.map(v2 => transformAnyValuesDeep(v2, pred, isTransformTargetType));
      continue;
    }
    if (isRecord(v)) {
      re[k] = transformAnyValuesDeep(v, pred, isTransformTargetType);
      continue;
    }
    if (!isTransformTargetType(v)) continue;
    re[k] = pred(v);
  }
  return re;
}
/**
 * Deeply convert object values using specified predicate
 * @param o input object
 * @param pred applied to the object value which type is not object, array, null, function
 * @returns converted new object
 */
export function transformValuesDeep(o: Record<string, unknown>, pred: (o: TransformTargetType) => unknown) {
  return transformAnyValuesDeep(o, pred, defaultTransformTargetType);
}
