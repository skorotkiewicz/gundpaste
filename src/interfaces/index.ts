import { Dispatch, SetStateAction } from "react";

export interface IThemes {
  [key: string]: string;
}

export interface ICodeArea {
  data: string;
  ext: string;
  setData: Dispatch<SetStateAction<string>>;
}

export interface ILanguagesProps {
  ext: string;
  setExt: Dispatch<SetStateAction<string>>;
  editor: boolean;
  setTheme: Dispatch<SetStateAction<string>>;
  theme: string;
}

export interface IMonacoProps {
  ext: string;
  theme: string;
  data: string;
  setData: Dispatch<SetStateAction<string>>;
}

export interface IBins {
  id: string;
  title: string;
}

export interface IGunResult {
  ok: number | string;
  err: string;
}
