import { EditPropertyProps } from "adminjs";
import { FC } from "react";
type CustomSlugTypes = Omit<EditPropertyProps, "where">;
declare const SlugEdit: FC<CustomSlugTypes>;
export default SlugEdit;
