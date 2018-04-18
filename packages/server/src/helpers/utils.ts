export const clone = <T extends { [key: string]: any }>(aObject: T): T => {
  let bObject: T;
  let v: any;
  let k: any;
  bObject = (aObject instanceof Array ? [] : {}) as T;
  for (k in aObject) {
    v = aObject[k];
    bObject[k] = (typeof v === 'object') ? clone(v) : v;
  }
  return bObject;
};
