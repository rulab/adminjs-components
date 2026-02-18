import { buildFeature, ComponentLoader, FeatureType } from "adminjs";
import { bundleComponent } from "../../utils/bundle-component.js";
import type { AvailableValueType } from "./types.js";

type ColorStatusOptions = {
  componentLoader?: ComponentLoader;
  key: string;
  availableValues?: AvailableValueType[];
  nullable?: boolean;
};

const COMPONENT_NAME = "ColorStatus";

export const ColorStatusFeature = (config: ColorStatusOptions): FeatureType => {
  const { componentLoader, key, availableValues = [], nullable = false } = config;
  const values = nullable
    ? [{ value: null, label: "", color: "#ffffff" }, ...availableValues]
    : availableValues;

  const editComponent = bundleComponent(
    componentLoader,
    COMPONENT_NAME,
    "ColorStatusEdit.js",
  );
  const listComponent = bundleComponent(
    componentLoader,
    COMPONENT_NAME,
    "ColorStatusList.js",
  );
  const showComponent = bundleComponent(
    componentLoader,
    COMPONENT_NAME,
    "ColorStatusShow.js",
  );

  return buildFeature({
    properties: {
      [key]: {
        isVisible: { filter: true, show: true, edit: true, list: true },
        availableValues: values,
        custom: {
          nullable,
        },
        components: {
          edit: editComponent,
          list: listComponent,
          show: showComponent,
        },
      },
    },
  });
};

export default ColorStatusFeature;
