import React from "react";

import { theme } from "@adminjs/design-system";
import { ThemeProvider } from "styled-components";
import { parseHtml } from "../../utils/parseHtml";
import { StyledEditorViewWrapper } from "./styles";

const EditorList = ({ property, record }) => {
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
