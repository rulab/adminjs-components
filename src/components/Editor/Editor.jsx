import React, { memo, useState, useEffect, useRef } from "react";
import { ThemeProvider } from "styled-components";
import EditorJS from "@editorjs/editorjs";
import { theme } from "@adminjs/design-system";

import { Label, StyledEditor, EditorWrapper } from "./styles";

import { EDITOR_TOOLS } from "./config";

const Editor = ({ property, record, onChangeAdmin, editorId }) => {
  const [jsonData, setJsonData] = useState();

  const ref = useRef();

  useEffect(() => {
    onChangeAdmin(property.path, jsonData);
  }, [jsonData]);

  useEffect(() => {
    if (!ref.current) {
      const editor = new EditorJS({
        holder: editorId,

        tools: EDITOR_TOOLS,
        data: JSON.parse(record.params.editor),
        async onChange(api, event) {
          const data = await api.saver.save();
          setJsonData(JSON.stringify(data));
        },
      });
      ref.current = editor;
    }

    return () => {
      if (ref.current && ref.current.destroy) {
        ref.current.destroy();
      }
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Label>Text</Label>
      <EditorWrapper>
        <StyledEditor id={editorId} />
      </EditorWrapper>
    </ThemeProvider>
  );
};

export default Editor;
