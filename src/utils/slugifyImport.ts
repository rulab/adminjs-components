// This is a fix of typescript module import error
import slugify from "slugify";

export default slugify as unknown as typeof slugify.default;
