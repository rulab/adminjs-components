import React, { useState, useEffect } from "react";
import Select from "react-select";
import chroma from "chroma-js";
import { ColorStatusWrapper, Label } from "./styles";
const dot = (color = "transparent") => ({
    alignItems: "center",
    display: "flex",
    ":before": {
        backgroundColor: color,
        borderRadius: 10,
        content: '" "',
        display: "block",
        marginRight: 8,
        height: 10,
        width: 10,
    },
});
const colorStyles = {
    control: (styles) => ({ ...styles, backgroundColor: "white" }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        const color = chroma(data.color);
        return {
            ...styles,
            backgroundColor: isSelected
                ? data.color
                : isFocused
                    ? color.alpha(0.1).css()
                    : undefined,
            color: isSelected
                ? chroma.contrast(color, "white") > 2
                    ? "white"
                    : "black"
                : data.color,
            ":active": {
                ...styles[":active"],
                backgroundColor: isSelected ? data.color : color.alpha(0.3).css(),
            },
        };
    },
    input: (styles) => ({ ...styles, ...dot() }),
    placeholder: (styles) => ({ ...styles, ...dot("#ccc") }),
    singleValue: (styles, { data }) => ({ ...styles, ...dot(data.color) }),
};
export const ColorStatusEdit = ({ property, record, onChange }) => {
    const availableValues = property.availableValues;
    const currentOption = availableValues.find((item) => item.value === record.params[property.path]);
    const [selectOption, setCurrentOption] = useState(currentOption);
    const handleSelectChange = (option) => {
        setCurrentOption(option);
    };
    useEffect(() => {
        onChange(property.path, selectOption?.value);
    }, [selectOption]);
    return (React.createElement(ColorStatusWrapper, null,
        React.createElement(Label, null, property.label ?? property.path),
        React.createElement(Select, { className: "basic-single", classNamePrefix: "select", defaultValue: selectOption ?? availableValues[0], onChange: handleSelectChange, isClearable: true, name: "color", options: availableValues, styles: colorStyles })));
};
export default ColorStatusEdit;
