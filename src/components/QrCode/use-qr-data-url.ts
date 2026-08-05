import { useEffect, useState } from "react";
import QRCode from "qrcode";

export const useQrDataUrl = (url: string | null | undefined, enabled: boolean) => {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!enabled || !url) {
      setDataUrl(null);
      setError(null);
      return;
    }

    void QRCode.toDataURL(url, {
      width: 256,
      margin: 2,
      errorCorrectionLevel: "M",
    })
      .then((result) => {
        if (!cancelled) {
          setDataUrl(result);
          setError(null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setDataUrl(null);
          setError("Failed to generate QR code.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [url, enabled]);

  return { dataUrl, error };
};
