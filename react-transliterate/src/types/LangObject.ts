import { Language } from "./Language";

export type LangObject = {
  Author: string;
  CompiledDate: string;
  Direction: "ltr" | "rtl";
  DisplayName: string;
  Identifier: Language;
  IsStable: boolean;
  LangCode: Language;
  GoogleFont: string;
  FallbackFont: string;
};
