import { i18n } from "@lingui/core";
import dayjs from "dayjs";

import { dayjsLocales } from "./dayjs";

export const defaultLocale = "en-US";

i18n.on("missing", (event) => {
  // event is an object with properties { locale: string; id: string; }
  const { id } = event;
  return id; // Use the key itself as the fallback
});

export async function dynamicActivate(locale: string) {
  try {
    locale = defaultLocale;
    const { messages } = await import(`../locales/${locale}/messages.po`);

    if (messages) {
      i18n.loadAndActivate({ locale, messages });
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (dayjsLocales[locale]) {
      dayjs.locale(await dayjsLocales[locale]());
    }
  } catch (error) {
    console.error(error);
  }
}
