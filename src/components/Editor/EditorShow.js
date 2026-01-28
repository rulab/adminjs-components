import React from "react";
import { ThemeProvider } from "styled-components";
import { theme } from "@adminjs/design-system";
import { parseHtml } from "../../utils/parseHtml.js";
import { StyledEditorShowWrapper, StyledShowLabel } from "./styles.js";
export const EditorShow = ({ property, record }) => {
    const htmlContent = parseHtml(record.params[property.path]);
    return (React.createElement(ThemeProvider, { theme: theme },
        React.createElement(StyledEditorShowWrapper, null,
            React.createElement(StyledShowLabel, null, property.label ?? property.path),
            htmlContent && (React.createElement("div", { dangerouslySetInnerHTML: { __html: htmlContent } })))));
};
export default EditorShow;
