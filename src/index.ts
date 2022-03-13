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
export function transformAnyValuesDeep<T>(
  o: Record<string, unknown> | Array<unknown>,
  pred: (o: T) => unknown,
  isTransformTargetType: (o: unknown) => o is T
): object {
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
export function transformValuesDeep(o: Record<string, unknown>, pred: (o: TransformTargetType) => unknown) {
  return transformAnyValuesDeep(o, pred, defaultTransformTargetType);
}
