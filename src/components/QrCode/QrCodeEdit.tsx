import { Box, Button, Icon, Text } from "@adminjs/design-system";
import type { EditPropertyProps } from "adminjs";
import React, { FC, SyntheticEvent, useMemo, useState } from "react";
import { ThemeProvider } from "styled-components";
import { theme } from "@adminjs/design-system";

import { resolveTemplate } from "./resolve-template.js";
import { useQrDataUrl } from "./use-qr-data-url.js";

type QrCodeEditProps = Omit<EditPropertyProps, "where">;

const NOT_GENERATED_MESSAGE = "QR code has not been generated yet.";
const EMPTY_URL_MESSAGE =
  "Cannot generate QR code: the URL template resolved to an empty string. Check that referenced fields have values.";

export const QrCodeEdit: FC<QrCodeEditProps> = ({
  property,
  record,
  onChange,
}) => {
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

  const handleGenerate = (e: SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!resolvedUrl.trim()) {
      setLocalError(EMPTY_URL_MESSAGE);
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

  return (
    <ThemeProvider theme={theme}>
      <Box mb="lg">
        <Text mb="default" fontWeight="bold">
          {property.label ?? property.path}
        </Text>

        {!isGenerated && (
          <Box>
            <Text mb="lg">{NOT_GENERATED_MESSAGE}</Text>
            {(localError || qrError) && (
              <Text mb="default" color="error">
                {localError ?? qrError}
              </Text>
            )}
            <Button variant="primary" onClick={handleGenerate}>
              Generate
            </Button>
          </Box>
        )}

        {isGenerated && (
          <Box>
            {(localError || qrError) && (
              <Text mb="default" color="error">
                {localError ?? qrError}
              </Text>
            )}
            {dataUrl && (
              <Box mb="lg">
                <img
                  src={dataUrl}
                  alt={`QR code for ${property.path}`}
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
                Download
              </Box>
            </Button>
          </Box>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default QrCodeEdit;
