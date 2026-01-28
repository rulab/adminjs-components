import { buildFeature } from "adminjs";
import { bundleComponent } from "../../utils/bundle-component.js";
const COMPONENT_NAME = "Preview";
const createPreviewFeature = (config) => {
  const { componentLoader, url, actionName = "preview" } = config;
  const actionComponent = bundleComponent(
    componentLoader,
    COMPONENT_NAME,
    "PreviewAction.js",
  );
  return buildFeature({
    actions: {
      [actionName]: {
        actionType: "record",
        icon: "Eye",
        label: "Preview",
        showInDrawer: false,
        component: actionComponent,
        handler: async (request, response, context) => ({
          record: context.record?.toJSON(context.currentAdmin),
        }),
      },
    },
    properties: {
      __previewUrlTemplate: {
        isVisible: false,
        custom: {
          value: url,
        },
      },
    },
  });
};
export const PreviewFeature = createPreviewFeature;
export default createPreviewFeature;
