export const fetchBytes = async (url: string) => await fetch(url).then((result) => result.arrayBuffer());
export const fetchText = async (url: string) => await fetch(url).then((result) => result.text());

export const nullOf = <T>(obj: T) => null as unknown as T;
export const undefinedOf = <T>(obj: T) => undefined as unknown as T;

export const refresh = () => window.location.reload();

export const addToDict = (dict: any, dictSetter: any, key: any, value: any) => dictSetter({...dict, [key]: value});
export const setDict = (dictSetter: any, object: any) => dictSetter(object);

export const addToArray = (arraySetter: any, array: any, object: any) => arraySetter([...array, object]);
export const setArray = (arraySetter: any, object: any) => arraySetter(object);
