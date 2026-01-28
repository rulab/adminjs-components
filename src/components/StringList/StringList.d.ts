import { EditPropertyProps } from "adminjs";
import { FC } from "react";
type StringListTypes = Omit<EditPropertyProps, "where" | "resource">;
interface StringListShowPropsType extends StringListTypes {
    stringListSeparator?: string;
}
declare const StringList: FC<StringListShowPropsType>;
export default StringList;
