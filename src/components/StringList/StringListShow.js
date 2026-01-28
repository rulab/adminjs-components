import React from "react";
import { ThemeProvider } from "styled-components";
import { theme } from "@adminjs/design-system";
import { StyledShowLabel, StyledShowWrapper, StyledListItem } from "./styles";
import { separator } from "./constants";
export const StringListShow = ({ property, record, stringListSeparator = separator, }) => {
    return (React.createElement(ThemeProvider, { theme: theme },
        React.createElement(StyledShowWrapper, null,
            React.createElement(StyledShowLabel, null, property.label ?? property.path),
            record.params.facts && (React.createElement("ul", null, record.params.facts
                .split(stringListSeparator)
                .map((item, index) => (React.createElement(StyledListItem, { key: index }, `- ${item}`))))))));
};
export default StringListShow;
