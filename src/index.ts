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
function transformAnyValuesDeepImpl<T>(
  v: unknown,
  pred: (o: T) => unknown,
  isTransformTargetType: (o: unknown) => o is T
): unknown {
  if (Array.isArray(v) || isRecord(v)) {
    return transformAnyValuesDeep(v, pred, isTransformTargetType);
  }
  if (isTransformTargetType(v)) {
    return pred(v);
  }
  return v;
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
  if (Array.isArray(o)) {
    return o.map(v => transformAnyValuesDeepImpl(v, pred, isTransformTargetType));
  }
  const re: Record<string, unknown> = { ...o };
  for (const [k, v] of Object.entries(re)) {
    re[k] = transformAnyValuesDeepImpl(v, pred, isTransformTargetType);
  }
  return re;
}
/**
 * Deeply convert object values using specified predicate
 * @param o input object
 * @param pred applied to the object value which type is not object, array, null, function
 * @returns converted new object
 */
export function transformValuesDeep(
  o: Record<string, unknown> | Array<unknown>,
  pred: (o: TransformTargetType) => unknown
) {
  return transformAnyValuesDeep(o, pred, defaultTransformTargetType);
}
