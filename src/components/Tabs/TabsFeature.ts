import { buildFeature, ComponentLoader, FeatureType } from "adminjs";
import { bundleComponent } from "../../utils/bundle-component.js";

type TabsOptions = {
  componentLoader?: ComponentLoader;
  commonTabLabel?: string;
};

const COMPONENT_NAME = "Tabs";

export const TabsFeature = (config: TabsOptions): FeatureType => {
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
