import React from "react";
import { theme } from "@adminjs/design-system";
import { ThemeProvider } from "styled-components";
import { parseHtml } from "../../utils/parseHtml.js";
import { StyledEditorViewWrapper } from "./styles.js";
export const EditorList = ({ property, record }) => {
    const htmlContent = parseHtml(record.params[property.path]);
    return (React.createElement(ThemeProvider, { theme: theme },
        React.createElement(StyledEditorViewWrapper, null, htmlContent && (React.createElement("div", { dangerouslySetInnerHTML: { __html: htmlContent } })))));
};
export default EditorList;
