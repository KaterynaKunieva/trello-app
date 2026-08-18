function isObject(item: unknown): item is Record<string, unknown> {
  return Boolean(item && typeof item === 'object' && !Array.isArray(item));
}

// get value by dot-notation path (e.g. custom.color => {custom: {color: ...}})
function getByPath<TValue = string, TObj extends Record<string, unknown> = Record<string, unknown>>(
  obj: TObj,
  path: string
): TValue {
  if (!obj || !path) {
    return '' as TValue;
  }
  const result = path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
  return (result ?? '') as TValue;
}

// get partial object by dot-notation
function getPartialObjByPath<TObj extends Record<string, unknown> = Record<string, unknown>>(
  obj: TObj,
  path: string
): TObj {
  if (!obj || !path) {
    return {} as TObj;
  }

  const value = getByPath(obj, path);

  return path.split('.').reduceRight<unknown>((acc, key) => ({ [key]: acc }), value) as TObj;
}

// set value in object by dot-notation path
function setByPath<TObj extends Record<string, unknown>>(obj: TObj, path: string, value: unknown): TObj {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  const keys = path.split('.');

  function update(current: Record<string, unknown>, index: number): Record<string, unknown> {
    const key = keys[index];

    if (index === keys.length - 1) {
      return {
        ...current,
        [key]: value,
      };
    }

    const currentValue = current[key];
    const nextNode = isObject(currentValue) ? currentValue : {};

    return {
      ...current,
      [key]: update(nextNode, index + 1),
    };
  }

  return update(obj, 0) as TObj;
}

// applies callback func on all paths (in dot-notation) in object
function applyToAllValues<TObj extends Record<string, unknown>>(obj: TObj, callback: (path: string) => void): void {
  const stack: { current: unknown | string; path: string }[] = [
    {
      current: obj,
      path: '',
    },
  ];
  while (stack.length > 0) {
    const node = stack.pop();
    if (!node) break;
    const { current, path } = node;
    if (current !== null && typeof current === 'object') {
      const currentRecord = current as Record<string, unknown>;
      Object.keys(currentRecord).forEach((key) => {
        stack.push({
          current: currentRecord[key],
          path: path?.trim() ? `${path}.${key}` : key,
        });
      });
    } else {
      callback(path);
    }
  }
}

function deepClone<T>(obj: T): T {
  return structuredClone ? structuredClone(obj) : JSON.parse(JSON.stringify(obj));
}

export { getByPath, getPartialObjByPath, setByPath, applyToAllValues, deepClone };
