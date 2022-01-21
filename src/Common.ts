export const fetchBytes = async (url: string) => await fetch(url).then((result) => result.arrayBuffer());
export const fetchText = async (url: string) => await fetch(url).then((result) => result.text());

export const nullOf = <T>(obj: T) => null as unknown as T;
export const undefinedOf = <T>(obj: T) => undefined as unknown as T;

export const refresh = () => window.location.reload();

export const addToDict = (dictSetter: any, dict: any, key: any, value: any) => dictSetter({...dict, [key]: value});
export const setDict = (dictSetter: any, object: any) => dictSetter(object);

export const addToArray = (arraySetter: any, array: any, object: any) => arraySetter([...array, object]);
export const setArray = (arraySetter: any, object: any) => arraySetter(object);

export const indexToLetter = (index: number) => String.fromCharCode(97 + index % 26);

export const gSortPred = (one: any, other: any, key: string) => one[key]! === other[key]! ? 0 : one[key]! < other[key]! ? -1 : 1;
