import React from "react";
import { ColorStatusBadge } from "./styles";
export const ColorStatusList = ({ property, record }) => {
    const currentOption = property.availableValues?.find((item) => item.value === record.params[property.path]);
    const currentValue = record.params[property.path];
    const displayValue = currentOption?.label ?? currentValue;
    return (React.createElement(ColorStatusBadge, { color: currentOption?.color }, displayValue));
};
export default ColorStatusList;
