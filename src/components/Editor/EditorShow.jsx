import React, { memo, useState, useEffect, useRef } from "react";
import { ThemeProvider } from "styled-components";
import { theme } from "@adminjs/design-system";

import { parseHtml } from "../../utils/parseHtml";

import { Label } from "./styles";

const EditorShow = ({ property, record }) => {
  const htmlContent = parseHtml(record.params[property.path]);

  return (
    <ThemeProvider theme={theme}>
      <Label>Content</Label>
      {htmlContent && (
        <div dangerouslySetInnerHTML={{ __html: String(htmlContent) }} />
      )}
    </ThemeProvider>
  );
};

export default EditorShow;
