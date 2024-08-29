import React, { memo, useState, useEffect, useRef } from "react";
import { ThemeProvider } from "styled-components";
import { theme } from "@adminjs/design-system";

import { parseHtml } from "../../utils/parseHtml";

import { EditorShowWrapper } from "./styles";

import { ShowLabel } from "./styles";

const EditorShow = ({ property, record }) => {
  const htmlContent = parseHtml(record.params[property.path]);

  return (
    <ThemeProvider theme={theme}>
      <EditorShowWrapper>
        <ShowLabel>{property.path}</ShowLabel>
        {htmlContent && (
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        )}
      </EditorShowWrapper>
    </ThemeProvider>
  );
};

export default EditorShow;
