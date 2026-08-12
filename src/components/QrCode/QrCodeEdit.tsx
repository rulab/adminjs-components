import { Box, Button, Icon, Text } from "@adminjs/design-system";
import type { EditPropertyProps } from "adminjs";
import { useTranslation } from "adminjs";
import React, { FC, SyntheticEvent, useMemo, useState } from "react";
import { ThemeProvider } from "styled-components";
import { theme } from "@adminjs/design-system";

import { resolveTemplate } from "./resolve-template.js";
import { useQrDataUrl } from "./use-qr-data-url.js";

type QrCodeEditProps = Omit<EditPropertyProps, "where">;

const DEFAULT_NOT_GENERATED = "QR code has not been generated yet.";
const DEFAULT_EMPTY_URL =
  "Cannot generate QR code: the URL template resolved to an empty string. Check that referenced fields have values.";
const DEFAULT_GENERATE_FAILED = "Failed to generate QR code.";

export const QrCodeEdit: FC<QrCodeEditProps> = ({
  property,
  record,
  onChange,
}) => {
  const { translateProperty, translateMessage, translateButton } =
    useTranslation();
  const resourceId = property.resourceId;

  const urlTemplate =
    (property as { custom?: { urlTemplate?: string } }).custom?.urlTemplate ??
    "";
  const flagValue = record?.params?.[property.path];
  const isGenerated = Boolean(flagValue);

  const [localError, setLocalError] = useState<string | null>(null);

  const resolvedUrl = useMemo(
    () => resolveTemplate(urlTemplate, record?.params ?? {}),
    [urlTemplate, record?.params],
  );

  const { dataUrl, error: qrError } = useQrDataUrl(
    resolvedUrl,
    isGenerated && Boolean(resolvedUrl),
  );

  const notGeneratedMessage = translateMessage(
    "qrCodeNotGenerated",
    resourceId,
    { defaultValue: DEFAULT_NOT_GENERATED },
  );
  const emptyUrlMessage = translateMessage("qrCodeEmptyUrl", resourceId, {
    defaultValue: DEFAULT_EMPTY_URL,
  });
  const generateFailedMessage = translateMessage(
    "qrCodeGenerateFailed",
    resourceId,
    { defaultValue: DEFAULT_GENERATE_FAILED },
  );
  const generateLabel = translateButton("generateQrCode", resourceId, {
    defaultValue: "Generate",
  });
  const downloadLabel = translateButton("downloadQrCode", resourceId, {
    defaultValue: "Download",
  });

  const handleGenerate = (e: SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!resolvedUrl.trim()) {
      setLocalError(emptyUrlMessage);
      return;
    }
    setLocalError(null);
    onChange(property.path, new Date().toISOString());
  };

  const handleDownload = (e: SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!dataUrl) {
      return;
    }
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `qr-${property.path}.png`;
    link.click();
  };

  const errorText = localError ?? (qrError ? generateFailedMessage : null);

  return (
    <ThemeProvider theme={theme}>
      <Box mb="lg">
        <Text mb="default" fontWeight="bold">
          {translateProperty(property.label, resourceId)}
        </Text>

        {!isGenerated && (
          <Box>
            <Text mb="lg">{notGeneratedMessage}</Text>
            {errorText && (
              <Text mb="default" color="error">
                {errorText}
              </Text>
            )}
            <Button variant="primary" onClick={handleGenerate}>
              {generateLabel}
            </Button>
          </Box>
        )}

        {isGenerated && (
          <Box>
            {errorText && (
              <Text mb="default" color="error">
                {errorText}
              </Text>
            )}
            {dataUrl && (
              <Box mb="lg">
                <img
                  src={dataUrl}
                  alt={translateProperty(property.label, resourceId)}
                  width={256}
                  height={256}
                />
              </Box>
            )}
            {resolvedUrl && (
              <Text mb="lg" variant="sm" color="grey60">
                {resolvedUrl}
              </Text>
            )}
            <Button
              variant="outlined"
              onClick={handleDownload}
              disabled={!dataUrl}
            >
              <Box
                as="span"
                display="inline-flex"
                alignItems="center"
                style={{ gap: 6 }}
              >
                <Icon icon="Download" />
                {downloadLabel}
              </Box>
            </Button>
          </Box>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default QrCodeEdit;
