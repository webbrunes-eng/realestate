import { cookies } from "next/headers";
import { dictionaries, type Locale, type Dict } from "./dict";

export const LOCALE_COOKIE = "brunes_locale";

export async function getLocale(): Promise<Locale> {
  const jar = await cookies();
  const v = jar.get(LOCALE_COOKIE)?.value;
  return v === "sq" ? "sq" : "en";
}

export async function getDict(): Promise<{ dict: Dict; locale: Locale }> {
  const locale = await getLocale();
  return { dict: dictionaries[locale], locale };
}

export { dictionaries };
export type { Locale, Dict };
