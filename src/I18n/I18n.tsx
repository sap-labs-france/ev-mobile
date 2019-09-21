import i18n from "i18n-js";
import { I18nManager } from "react-native";
import * as RNLocalize from "react-native-localize";

const translationGetters: any = {
  en: () => require("./languages/en.json"),
  de: () => require("./languages/de.json"),
  fr: () => require("./languages/fr.json"),
};

// fallback if no available language fits
const fallback = { languageTag: "en", isRTL: false };

const { languageTag, isRTL } =
  RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) || fallback;

// update layout direction
I18nManager.forceRTL(isRTL);

// set i18n-js config
i18n.translations = { [languageTag]: translationGetters[languageTag]() };
i18n.locale = languageTag;

export default i18n;
