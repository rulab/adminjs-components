import React from "react";

import { theme } from "@adminjs/design-system";
import { ThemeProvider } from "styled-components";
import { parseHtml } from "../../utils/parseHtml.js";
import { StyledEditorViewWrapper } from "./styles.js";

export const EditorList = ({ property, record }) => {
  const htmlContent = parseHtml(record.params[property.path]);

  return (
    <ThemeProvider theme={theme}>
      <StyledEditorViewWrapper>
        {htmlContent && (
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        )}
      </StyledEditorViewWrapper>
    </ThemeProvider>
  );
};

export default EditorList;
