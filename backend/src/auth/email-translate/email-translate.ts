import { fr } from './fr.js';
import { en } from './en.js';
import { de } from './de.js';
import { pt } from './pt.js';
import { ru } from './ru.js';
import { zh } from './zh.js';

export const emailTranslations = {
  fr,
  en,
  de,
  pt,
  ru,
  zh,
};

export type EmailLanguage = keyof typeof emailTranslations;

export function getEmailTranslations(language: string) {
  if (language in emailTranslations) {
    return emailTranslations[language as EmailLanguage];
  }

  return emailTranslations.fr;
}