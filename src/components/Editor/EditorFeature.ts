import { buildFeature, ComponentLoader, FeatureType } from "adminjs";
import type { UploadedFile, ActionContext } from "adminjs";
import type { BaseProvider } from "@adminjs/upload";
import { Buffer } from "node:buffer";
import { promises as fs } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { bundleComponent } from "../../utils/bundle-component.js";
import { slugifyTitle } from "../../utils/slugifyTitle.js";

type EditorOptions = {
  componentLoader?: ComponentLoader;
  key: string;
  uploadProvider?: BaseProvider;
  uploadActionName?: string;
};

const COMPONENT_NAME = "Editor";

export const EditorFeature = (config: EditorOptions): FeatureType => {
  const { componentLoader, key, uploadProvider } = config;
  const uploadActionName = config.uploadActionName ?? "editorUpload";

  const editComponent = bundleComponent(componentLoader, COMPONENT_NAME, "Editor.js");
  const listComponent = bundleComponent(componentLoader, COMPONENT_NAME, "EditorList.js");
  const showComponent = bundleComponent(componentLoader, COMPONENT_NAME, "EditorShow.js");

  return buildFeature({
    actions: uploadProvider
      ? {
          [uploadActionName]: {
            actionType: "resource",
            isVisible: false,
            handler: async (request, _response, context) => {
              const file = request?.payload?.file;
              if (!file?.base64) {
                return {
                  data: { error: "No file provided." },
                  notice: { message: "No file provided.", type: "error" },
                };
              }

              const buffer = Buffer.from(file.base64, "base64");
              const originalName = file.name ?? "upload";
              const filename = slugifyFilename(originalName);
              const key = `${Date.now()}-${filename}`;
              const tempPath = join(tmpdir(), `${Date.now()}-${filename}`);
              const uploadedFile: UploadedFile = {
                name: filename,
                type: file.type ?? "application/octet-stream",
                size: buffer.length,
                path: tempPath,
              };
              await fs.writeFile(tempPath, buffer);
              try {
                await uploadProvider.upload(
                  uploadedFile,
                  key,
                  context as ActionContext,
                );
              } finally {
                await fs.unlink(tempPath).catch(() => undefined);
              }
              const baseUrl = uploadProvider.opts?.baseUrl;
              const url = baseUrl
                ? `${baseUrl.replace(/\/$/, "")}/${key}`
                : await uploadProvider.path(
                    key,
                    uploadProvider.bucket,
                    context as ActionContext,
                  );
              if (!url) {
                return {
                  data: { error: "Upload failed." },
                  notice: { message: "Upload failed.", type: "error" },
                };
              }

              return { data: { url } };
            },
          },
        }
      : undefined,
    properties: {
      [key]: {
        isVisible: { filter: true, show: true, edit: true, list: true },
        props: uploadProvider ? { uploadAction: uploadActionName } : undefined,
        components: {
          edit: editComponent,
          list: listComponent,
          show: showComponent,
        },
      },
    },
  });
};

const slugifyFilename = (name: string) => {
  const lastDot = name.lastIndexOf(".");
  const base = lastDot > 0 ? name.slice(0, lastDot) : name;
  const ext = lastDot > 0 ? name.slice(lastDot) : "";
  const slug = slugifyTitle(base) || "file";
  return `${slug}${ext}`;
};

export default EditorFeature;
