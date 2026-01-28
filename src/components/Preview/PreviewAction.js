import { Box, Button, Text } from "@adminjs/design-system";
import React, { useMemo } from "react";
const resolveTemplate = (template, params) => template.replace(/\$([A-Za-z0-9_]+)/g, (_, key) => {
  const value = params?.[key];
  return value === undefined || value === null ? "" : String(value);
});
export const PreviewAction = ({ record, resource }) => {
  const template = resource?.properties?.__previewUrlTemplate?.custom?.value ?? "";
  const params = record?.params ?? {};
  const url = useMemo(() => resolveTemplate(template, params), [template, params]);
  if (!url) {
    return (React.createElement(Box, null,
      React.createElement(Text, null, "Preview URL is not configured.")));
  }
    return (React.createElement(Box, { height: "100%", display: "flex", flexDirection: "column" },
      React.createElement(Box, { mb: "lg", display: "flex", alignItems: "center" },
        React.createElement(Box, { mr: "md" },
          React.createElement(Button, { as: "a", variant: "outlined", onClick: () => window.history.back() }, "< Back")),
        React.createElement(Button, { as: "a", variant: "outlined", href: url, target: "_blank", rel: "noopener" }, "Open in new tab")),
      React.createElement(Box, { as: "iframe", src: url, title: "Preview", width: "100%", height: "calc(100vh - 300px)", style: { border: "1px solid #e5e7eb", borderRadius: "8px" } })));
};
export default PreviewAction;
