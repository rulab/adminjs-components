import React from "react";
import { ThemeProvider } from "styled-components";
import { theme } from "@adminjs/design-system";

import { parseHtml } from "../../utils/parseHtml.js";
import { StyledEditorShowWrapper, StyledShowLabel } from "./styles.js";

type EditorShowProps = {
  property: any;
  record: any;
};

export const EditorShow = ({ property, record }: EditorShowProps) => {
  const htmlContent = parseHtml(record.params[property.path]);

  return (
    <ThemeProvider theme={theme}>
      <StyledEditorShowWrapper>
        <StyledShowLabel>{property.label ?? property.path}</StyledShowLabel>
        {htmlContent && <div dangerouslySetInnerHTML={{ __html: htmlContent }} />}
      </StyledEditorShowWrapper>
    </ThemeProvider>
  );
};

export default EditorShow;
