import slugify from "./slugifyImport.js";
export const slugifyTitle = (title) => {
    return slugify(title, {
        replacement: "-",
        remove: /[*+~.()'"!:@]/g,
        lower: true,
        locale: "vi",
        trim: true,
    });
};
