import React, { memo, useState, useEffect, useRef } from "react";
import { ThemeProvider } from "styled-components";
import EditorJS from "@editorjs/editorjs";
import { theme } from "@adminjs/design-system";

import { StyledLabel, StyledEditor, StyledEditorWrapper } from "./styles";

import { EDITOR_TOOLS } from "./config";

const Editor = ({ property, record, onChangeAdmin, editorId }) => {
  const [jsonData, setJsonData] = useState();
  const isSavedData = Boolean(record.params[property.path]);

  const ref = useRef();

  useEffect(() => {
    onChangeAdmin(property.path, jsonData);
  }, [jsonData]);

  useEffect(() => {
    if (!ref.current) {
      const editor = new EditorJS({
        holder: editorId,
        tools: EDITOR_TOOLS,
        data: isSavedData ? JSON.parse(record.params[property.path]) : "",
        async onChange(api, event) {
          const data = await api.saver.save();
          setJsonData(JSON.stringify(data));
        },
      });
      ref.current = editor;
    }

    return () => {
      ref?.current?.destroy?.();
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <StyledLabel>{property.path}</StyledLabel>
      <StyledEditorWrapper>
        <StyledEditor id={editorId} />
      </StyledEditorWrapper>
    </ThemeProvider>
  );
};

export default Editor;
