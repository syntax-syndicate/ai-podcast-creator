export const I18N_LOCALE_COOKIE_NAME = "i18n:locale";

export const projectTypes = [
  "blank",
  "audiobook",
  "article",
  "podcast",
] as const;

export type ProjectType = (typeof projectTypes)[number];

export const projectStatuses = ["generating", "completed", "failed"] as const;

export type ProjectStatus = (typeof projectStatuses)[number];
