import React, { useEffect, useState, } from "react";
import { ThemeProvider } from "styled-components";
import { theme } from "@adminjs/design-system";
import { slugifyTitle } from "../../utils";
import { StyledCustomInput, StyledGenerateButton, StyledInputWrapper, StyledLabel, } from "./styles.js";
export const SlugEdit = ({ property, record, resource, onChange, }) => {
    const [inputValue, setInputValue] = useState(record.params.slug);
    useEffect(() => {
        onChange(property.path, inputValue);
    }, [inputValue]);
    return (React.createElement(ThemeProvider, { theme: theme },
        React.createElement(StyledLabel, { htmlFor: "customSlug" }, property.label ?? property.path),
        React.createElement(StyledInputWrapper, null,
            React.createElement(StyledCustomInput, { id: property.path, name: property.path, value: inputValue, onChange: handleInput }),
            React.createElement(StyledGenerateButton, { variant: "outlined", onClick: generateSlug }, "Generate Slug"))));
    function handleInput(e) {
        setInputValue(e.target.value);
    }
    function generateSlug(e) {
        e.preventDefault();
        const slugSource = record.params[property.props.sourceField ?? resource.titleProperty.name];
        if (slugSource) {
            setInputValue(slugifyTitle(slugSource));
        }
    }
};
export default SlugEdit;
