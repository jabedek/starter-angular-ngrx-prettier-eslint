export function createNamesArray(names: string) {
  const cp = names;
  const r0 = /\s/gm;
  const res = cp
    .replaceAll(r0, ',')
    .split(',')
    .filter((name) => name)
    .sort();

  return res;
}

export function getArrayToVerticalList(names: string[]) {
  let res0 = '';
  names.forEach((name) => {
    const newV = `${name}` + '\n';
    res0 += newV;
  });

  return res0;
}

export function sortNamesAlph(names: string) {
  const sorted = createNamesArray(names);
  const listString = getArrayToVerticalList(sorted);
  return listString;
}

export function sortNamesLength(names: string[]) {
  return names.sort((a, b) => {
    const aLen = a.length;
    const bLen = b.length;

    return aLen < bLen ? -1 : aLen === bLen ? 0 : 1;
  });
}
