import { buildFeature } from "adminjs";
import { bundleComponent } from "../../utils/bundle-component.js";
const COMPONENT_NAME = "Tabs";
export const TabsFeature = (config) => {
  const { componentLoader, commonTabLabel } = config;
  const editComponent = bundleComponent(
    componentLoader,
    COMPONENT_NAME,
    "TabsEdit.js",
  );
  const showComponent = bundleComponent(
    componentLoader,
    COMPONENT_NAME,
    "TabsShow.js",
  );
  return buildFeature({
    actions: {
      edit: {
        component: editComponent,
      },
      show: {
        component: showComponent,
      },
    },
    properties: {
      __tabsCommonLabel: {
        isVisible: false,
        custom: {
          value: commonTabLabel,
        },
      },
    },
  });
};
