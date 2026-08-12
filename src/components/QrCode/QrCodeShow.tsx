import { Box, Text } from "@adminjs/design-system";
import type { ShowPropertyProps } from "adminjs";
import { useTranslation } from "adminjs";
import React, { FC, useMemo } from "react";
import { ThemeProvider } from "styled-components";
import { theme } from "@adminjs/design-system";

import { resolveTemplate } from "./resolve-template.js";
import { useQrDataUrl } from "./use-qr-data-url.js";

const DEFAULT_NOT_GENERATED = "QR code has not been generated yet.";
const DEFAULT_GENERATE_FAILED = "Failed to generate QR code.";

export const QrCodeShow: FC<ShowPropertyProps> = ({ property, record }) => {
  const { translateProperty, translateMessage } = useTranslation();
  const resourceId = property.resourceId;

  const urlTemplate =
    (property as { custom?: { urlTemplate?: string } }).custom?.urlTemplate ??
    "";
  const flagValue = record?.params?.[property.path];
  const isGenerated = Boolean(flagValue);

  const resolvedUrl = useMemo(
    () => resolveTemplate(urlTemplate, record?.params ?? {}),
    [urlTemplate, record?.params],
  );

  const { dataUrl, error } = useQrDataUrl(
    resolvedUrl,
    isGenerated && Boolean(resolvedUrl),
  );

  const notGeneratedMessage = translateMessage(
    "qrCodeNotGenerated",
    resourceId,
    { defaultValue: DEFAULT_NOT_GENERATED },
  );
  const generateFailedMessage = translateMessage(
    "qrCodeGenerateFailed",
    resourceId,
    { defaultValue: DEFAULT_GENERATE_FAILED },
  );

  return (
    <ThemeProvider theme={theme}>
      <Box mb="lg">
        <Text mb="default" fontWeight="bold">
          {translateProperty(property.label, resourceId)}
        </Text>

        {!isGenerated && <Text>{notGeneratedMessage}</Text>}

        {isGenerated && (
          <Box>
            {error && (
              <Text mb="default" color="error">
                {generateFailedMessage}
              </Text>
            )}
            {dataUrl && (
              <Box mb="default">
                <img
                  src={dataUrl}
                  alt={translateProperty(property.label, resourceId)}
                  width={256}
                  height={256}
                />
              </Box>
            )}
            {resolvedUrl && (
              <Text variant="sm" color="grey60">
                {resolvedUrl}
              </Text>
            )}
          </Box>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default QrCodeShow;
