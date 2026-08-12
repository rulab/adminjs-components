import React, { useState, useEffect, useRef } from "react";
import { ThemeProvider } from "styled-components";
import { theme } from "@adminjs/design-system";
import { ApiClient, useTranslation } from "adminjs";

import { StyledLabel, StyledEditor, StyledEditorWrapper } from "./styles.js";
import { EDITOR_TOOLS } from "./config.js";

type EditorUploadResult = {
  url: string;
  name: string;
  size: number;
  extension: string;
};

type EditorProps = {
  property: any;
  record: any;
  resource: any;
  onChange?: (path: string, value: string | undefined) => void;
  onChangeAdmin?: (path: string, value: string | undefined) => void;
  editorId?: string;
};

const readFileAsBase64 = (file: File): Promise<string> =>
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

const extensionFromFilename = (name: string): string => {
  const i = name.lastIndexOf(".");
  if (i <= 0 || i === name.length - 1) {
    return "";
  }
  return name.slice(i + 1).toLowerCase();
};

const uploadFileViaEditorAction = async (
  api: ApiClient,
  resourceId: string,
  uploadAction: string,
  file: File,
): Promise<EditorUploadResult | null> => {
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
  const data = response?.data?.data as
    | { url?: string; name?: string; size?: number; extension?: string }
    | undefined;
  const url = data?.url;
  if (!url) {
    return null;
  }
  return {
    url,
    name: data?.name ?? file.name,
    size: data?.size ?? file.size,
    extension: data?.extension ?? extensionFromFilename(file.name),
  };
};

const getEditorData = (record: any, property: any) => {
  const raw = record?.params?.[property.path];
  if (!raw) {
    return "";
  }
  try {
    return JSON.parse(raw);
  } catch {
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
}: EditorProps) => {
  const { translateProperty } = useTranslation();
  const [jsonData, setJsonData] = useState<string>();
  const isSavedData = Boolean(record?.params?.[property.path]);
  const holderId = editorId || property?.props?.editorId || `editor-${property.path}`;
  const uploadAction = property?.custom?.uploadAction ?? property?.props?.uploadAction;
  const resourceId = resource?.id;

  const ref = useRef<any>();

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
        const tools: Record<string, any> = { ...EDITOR_TOOLS };
        if (uploadAction && resourceId) {
          const { default: ImageTool } = await import("@editorjs/image");
          const { default: AttachesTool } = await import("@editorjs/attaches");
          const api = new ApiClient();
          tools.image = {
            class: ImageTool,
            config: {
              uploader: {
                uploadByFile: async (file: File) => {
                  const uploaded = await uploadFileViaEditorAction(
                    api,
                    resourceId,
                    uploadAction,
                    file,
                  );
                  if (!uploaded) {
                    return { success: 0 };
                  }
                  return { success: 1, file: { url: uploaded.url } };
                },
              },
            },
          };
          tools.attaches = {
            class: AttachesTool,
            config: {
              types: "*",
              buttonText: "Attach file",
              uploader: {
                uploadByFile: async (file: File) => {
                  const uploaded = await uploadFileViaEditorAction(
                    api,
                    resourceId,
                    uploadAction,
                    file,
                  );
                  if (!uploaded) {
                    return { success: 0 };
                  }
                  return {
                    success: 1,
                    file: {
                      url: uploaded.url,
                      name: uploaded.name,
                      size: uploaded.size,
                      extension: uploaded.extension,
                    },
                  };
                },
              },
            },
          };
        }

        const editor = new EditorJS({
          holder: holderId,
          tools,
          data: isSavedData ? getEditorData(record, property) : "",
          async onChange(api: any) {
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
      <StyledLabel>
        {translateProperty(property.label, property.resourceId)}
      </StyledLabel>
      <StyledEditorWrapper>
        <StyledEditor id={holderId} />
      </StyledEditorWrapper>
    </ThemeProvider>
  );
};

export default Editor;
