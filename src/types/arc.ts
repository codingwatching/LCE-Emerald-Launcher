export interface ArcEntry {
  filename: string;
  ptr: number;
  size: number;
  isCompressed: boolean;
  data: Uint8Array;
}

export interface ArcFile {
  name: string;
  entries: ArcEntry[];
}

export interface LocString {
  key?: string;
  value: string;
}

export interface LocLanguage {
  id: string;
  version: number;
  isStatic: boolean;
  langId: string;
  strings: LocString[];
}

export interface LocFile {
  version: number;
  languages: LocLanguage[];
}
