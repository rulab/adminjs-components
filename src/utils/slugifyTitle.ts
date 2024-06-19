import slugify from "./slugifyImport.js";

export const slugifyTitle = (title: string) => {
  return slugify(title, {
    replacement: "-",
    remove: undefined,
    lower: true,
    locale: "vi",
    trim: true,
  });
};
