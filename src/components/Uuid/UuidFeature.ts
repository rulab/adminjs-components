import { buildFeature, ComponentLoader, FeatureType } from "adminjs";
import { bundleComponent } from "../../utils/bundle-component.js";
import UuidOptions from "./UuidOptions.type.js";

const COMPONENT_NAME = "Uuid";

export const UuidFeature = (config: UuidOptions): FeatureType => {
  const { componentLoader, key } = config;

  const editComponent = bundleComponent(componentLoader, COMPONENT_NAME, "UuidEdit.js");

  return buildFeature({
    properties: {
      [key]: {
        isVisible: { filter: true, show: true, edit: true, list: true },
        components: {
          edit: editComponent,
        },
      },
    },
  });
};

export default UuidFeature;

