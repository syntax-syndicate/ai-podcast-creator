import { parseAsString, createLoader } from "nuqs/server";

export const projectSearchParams = {
  chapterId: parseAsString,
};

export const loadSearchParams = createLoader(projectSearchParams);
