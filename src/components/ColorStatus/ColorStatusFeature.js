import { buildFeature } from "adminjs";
import { bundleComponent } from "../../utils/bundle-component.js";
const COMPONENT_NAME = "ColorStatus";
export const ColorStatusFeature = (config) => {
  const { componentLoader, key, availableValues = [] } = config;
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
        availableValues,
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
