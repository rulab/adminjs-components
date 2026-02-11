import { buildFeature } from "adminjs";
import { bundleComponent } from "../../utils/bundle-component.js";
const COMPONENT_NAME = "Uuid";
export const UuidFeature = (config) => {
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

