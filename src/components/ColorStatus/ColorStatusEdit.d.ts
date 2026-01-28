import { FC } from "react";
import { EditPropertyProps } from "adminjs";
type ColorStatusTypes = Omit<EditPropertyProps, "where" | "resource">;
declare const ColorStatus: FC<ColorStatusTypes>;
export default ColorStatus;
