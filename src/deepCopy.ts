/**
 * A dirty way to create a deep-copy of a save. The deep copy is usually created
 * to prevent the original copy from being edited or to force a re-render when
 * one of its deep objects might have been updated.
 * @param save
 * @returns
 */
export function deepCopy<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}
