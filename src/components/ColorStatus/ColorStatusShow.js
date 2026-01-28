import React from "react";
import { ColorStatusBadgeWrapper, ColorStatusBadge, ShowLabel } from "./styles";
export const ColorStatusShow = ({ property, record }) => {
    const currentOption = property.availableValues?.find((item) => item.value === record.params[property.path]);
    const currentValue = record.params[property.path];
    const displayValue = currentOption?.label ?? currentValue;
    return (React.createElement(ColorStatusBadgeWrapper, null,
        React.createElement(ShowLabel, null, property.label ?? property.path),
        React.createElement(ColorStatusBadge, { color: currentOption?.color }, displayValue)));
};
export default ColorStatusShow;
