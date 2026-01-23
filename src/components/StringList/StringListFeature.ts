import { buildFeature, ComponentLoader, FeatureType } from "adminjs";
import { bundleComponent } from "../../utils/bundle-component.js";

type StringListOptions = {
  componentLoader?: ComponentLoader;
  key: string;
};

const COMPONENT_NAME = "StringList";

export const StringListFeature = (config: StringListOptions): FeatureType => {
  const { componentLoader, key } = config;

  const editComponent = bundleComponent(
    componentLoader,
    COMPONENT_NAME,
    "StringList.js",
  );
  const showComponent = bundleComponent(
    componentLoader,
    COMPONENT_NAME,
    "StringListShow.js",
  );

  return buildFeature({
    properties: {
      [key]: {
        isVisible: { filter: true, show: true, edit: true, list: true },
        components: {
          edit: editComponent,
          show: showComponent,
        },
      },
    },
  });
};

export default StringListFeature;
