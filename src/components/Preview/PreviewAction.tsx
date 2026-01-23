import { Box, Button, Text } from "@adminjs/design-system";
import React, { FC, useMemo } from "react";
import { ActionProps } from "adminjs";

const resolveTemplate = (template: string, params: Record<string, any>) =>
  template.replace(/\$([A-Za-z0-9_]+)/g, (_, key) => {
    const value = params?.[key];
    return value === undefined || value === null ? "" : String(value);
  });

export const PreviewAction: FC<ActionProps> = ({ record, resource }) => {
  const template =
    (resource as any)?.properties?.__previewUrlTemplate?.custom?.value ?? "";
  const params = record?.params ?? {};
  const url = useMemo(() => resolveTemplate(template, params), [template, params]);
  if (!url) {
    return (
      <Box>
        <Text>Preview URL is not configured.</Text>
      </Box>
    );
  }

  return (
    <Box height="100%" display="flex" flexDirection="column">
      <Box mb="lg" display="flex" alignItems="center">
        <Box mr="md">
          <Button as="a" variant="outlined" onClick={() => window.history.back()}>
            &lt; Back
          </Button>
        </Box>
        <Button
          as="a"
          variant="outlined"
          href={url}
          target="_blank"
          rel="noopener"
        >
          Open in new tab
        </Button>
      </Box>
      <Box
        as="iframe"
        src={url}
        title="Preview"
        width="100%"
        height="calc(100vh - 300px)"
        style={{ border: "1px solid #e5e7eb", borderRadius: "8px" }}
      />
    </Box>
  );
};

export default PreviewAction;
