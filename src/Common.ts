export const fetchBytes = async (url: string) => await fetch(url).then((result) => result.arrayBuffer());
export const fetchText = async (url: string) => await fetch(url).then((result) => result.text());

export const nullOf = <T>(obj: T) => null as unknown as T;
export const undefinedOf = <T>(obj: T) => undefined as unknown as T;

export const refresh = () => window.location.reload();
