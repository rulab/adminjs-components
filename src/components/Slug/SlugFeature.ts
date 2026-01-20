import {buildFeature, ComponentLoader, FeatureType} from "adminjs";
import {bundleComponent} from "../../utils/bundle-component";
import SlugOptions from "./SlugOptions.type";

const COMPONENT_NAME = 'Slug'

const SlugFeature = (config: SlugOptions): FeatureType => {
    const {componentLoader,source,key} = config

    const editComponent = bundleComponent(componentLoader, COMPONENT_NAME, 'SlugEdit')

    return buildFeature({
        properties: {
            [key]: {
                isVisible: { filter: true, show: true, edit: true, list: true },
                components: {
                    edit: editComponent,
                },
                custom: {source,key}
            },
        },
    })

}

export default SlugFeature