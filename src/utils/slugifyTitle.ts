import slugify from "./slugifyImport.js";

export const slugifyTitle = (title: string) => {
  return slugify(title, {
    replacement: "-",
    remove: /[*+~.()'"!:@]/g,
    lower: true,
    locale: "vi",
    strict: true,
    trim: true,
  });
};
