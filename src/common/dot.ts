export function dotify(obj: object) {
  const res = {};

  function recurse(obj: object, current?: string) {
    for (const key in obj) {
      const value = obj[key];
      const newKey = current ? current + '.' + key : key;
      if (value && typeof value === 'object') {
        recurse(value, newKey);
      } else {
        res[newKey] = value;
      }
    }
  }

  recurse(obj);
  return res;
}
