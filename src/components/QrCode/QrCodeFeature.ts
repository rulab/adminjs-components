import { buildFeature, ComponentLoader, FeatureType } from "adminjs";
import { bundleComponent } from "../../utils/bundle-component.js";

export type QrCodeOptions = {
  componentLoader?: ComponentLoader;
  /** Resource property that stores the generation flag (ISO timestamp when generated). */
  key: string;
  /** URL template with `$field` placeholders (e.g. `https://example.com/page/$id/$uuid`). */
  url: string;
};

const COMPONENT_NAME = "QrCode";

/**
 * Adds a QR code property: stores a per-field generation flag in `key`, renders a QR from the
 * resolved `url` template. Edit supports Generate / Regenerate / Download; show is view-only.
 */
export const QrCodeFeature = (config: QrCodeOptions): FeatureType => {
  const { componentLoader, key, url } = config;

  const editComponent = bundleComponent(
    componentLoader,
    COMPONENT_NAME,
    "QrCodeEdit.js",
  );
  const showComponent = bundleComponent(
    componentLoader,
    COMPONENT_NAME,
    "QrCodeShow.js",
  );

  return buildFeature({
    properties: {
      [key]: {
        isVisible: {
          list: false,
          filter: false,
          show: true,
          edit: true,
        },
        components: {
          edit: editComponent,
          show: showComponent,
        },
        custom: {
          urlTemplate: url,
        },
      },
    },
  });
};

export default QrCodeFeature;
