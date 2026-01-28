import { FC } from "react";
import { ShowPropertyProps } from "adminjs";
interface StringListShowPropsType extends ShowPropertyProps {
    stringListSeparator?: string;
}
declare const StringListShow: FC<StringListShowPropsType>;
export default StringListShow;
