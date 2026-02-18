import { buildFeature, ComponentLoader, FeatureType } from "adminjs";
import { bundleComponent } from "../../utils/bundle-component.js";
import UuidOptions from "./UuidOptions.type.js";

const COMPONENT_NAME = "Uuid";

export const UuidFeature = (config: UuidOptions): FeatureType => {
  const { componentLoader, key, button } = config;

  const editComponent = bundleComponent(componentLoader, COMPONENT_NAME, "UuidEdit.js");

  return buildFeature({
    properties: {
      [key]: {
        isVisible: { filter: true, show: true, edit: true, list: true },
        custom: {
          button,
        },
        components: {
          edit: editComponent,
        },
      },
    },
  });
};

export default UuidFeature;

