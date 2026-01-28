import React, { useState, useEffect, useRef } from "react";
import { ThemeProvider } from "styled-components";
import { theme } from "@adminjs/design-system";
import { ApiClient } from "adminjs";

import { StyledLabel, StyledEditor, StyledEditorWrapper } from "./styles.js";

import { EDITOR_TOOLS } from "./config.js";

const readFileAsBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result ?? "";
      const base64 = String(result).split(",")[1] ?? "";
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const getEditorData = (record, property) => {
  const raw = record?.params?.[property.path];
  if (!raw) {
    return "";
  }
  try {
    return JSON.parse(raw);
  } catch (error) {
    return "";
  }
};

export const Editor = ({
  property,
  record,
  resource,
  onChange,
  onChangeAdmin,
  editorId,
}) => {
  const [jsonData, setJsonData] = useState();
  const isSavedData = Boolean(record?.params?.[property.path]);
  const holderId = editorId || property?.props?.editorId || `editor-${property.path}`;
  const uploadAction = property?.custom?.uploadAction ?? property?.props?.uploadAction;
  const resourceId = resource?.id;

  const ref = useRef();

  useEffect(() => {
    const changeHandler = onChange ?? onChangeAdmin;
    if (changeHandler) {
      changeHandler(property.path, jsonData);
    }
  }, [jsonData]);

  useEffect(() => {
    if (!ref.current) {
      const init = async () => {
        const { default: EditorJS } = await import("@editorjs/editorjs");
        const tools = { ...EDITOR_TOOLS };
        if (uploadAction && resourceId) {
          const { default: ImageTool } = await import("@editorjs/image");
          const api = new ApiClient();
          tools.image = {
            class: ImageTool,
            config: {
              uploader: {
                uploadByFile: async (file) => {
                  const base64 = await readFileAsBase64(file);
                  const response = await api.resourceAction({
                    resourceId,
                    actionName: uploadAction,
                    data: {
                      file: {
                        name: file.name,
                        type: file.type,
                        base64,
                      },
                    },
                  });
                  const url = response?.data?.data?.url;
                  if (!url) {
                    return { success: 0 };
                  }
                  return { success: 1, file: { url } };
                },
              },
            },
          };
        }

        const editor = new EditorJS({
          holder: holderId,
          tools,
          data: isSavedData ? getEditorData(record, property) : "",
          async onChange(api, event) {
            const data = await api.saver.save();
            setJsonData(JSON.stringify(data));
          },
        });
        ref.current = editor;
      };
      void init();
    }

    return () => {
      ref?.current?.destroy?.();
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <StyledLabel>{property.label ?? property.path}</StyledLabel>
      <StyledEditorWrapper>
        <StyledEditor id={holderId} />
      </StyledEditorWrapper>
    </ThemeProvider>
  );
};

export default Editor;
