import React, { memo, useState, useEffect, useRef } from "react";
import { ThemeProvider } from "styled-components";
import { theme } from "@adminjs/design-system";

import { parseHtml } from "../../utils/parseHtml";

import { StyledEditorShowWrapper, StyledShowLabel } from "./styles";

const EditorShow = ({ property, record }) => {
  const htmlContent = parseHtml(record.params[property.path]);

  return (
    <ThemeProvider theme={theme}>
      <StyledEditorShowWrapper>
        <StyledShowLabel>{property.path}</StyledShowLabel>
        {htmlContent && (
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        )}
      </StyledEditorShowWrapper>
    </ThemeProvider>
  );
};

export default EditorShow;
