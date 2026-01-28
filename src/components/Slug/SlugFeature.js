import { buildFeature } from "adminjs";
import { bundleComponent } from "../../utils/bundle-component.js";
const COMPONENT_NAME = 'Slug';
export const SlugFeature = (config) => {
    const { componentLoader, key } = config;
    const slugFeature = () => {
        const editComponent = bundleComponent(componentLoader, COMPONENT_NAME, 'SlugEdit.js');
        return buildFeature({
            properties: {
                [key]: {
                    isVisible: { show: false, edit: true, list: false, filter: false },
                    components: {
                        edit: editComponent,
                    },
                },
            },
        });
    };
    return slugFeature();
};
export default SlugFeature;
