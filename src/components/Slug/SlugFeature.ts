import {buildFeature, ComponentLoader, FeatureType} from "adminjs";
import {bundleComponent} from "../../utils/bundle-component";

const COMPONENT_NAME = 'Slug'

type SlugOptions = {
    componentLoader: ComponentLoader
    key: string
}
const SlugFeature = (config: SlugOptions): FeatureType => {
    const {componentLoader,key} = config

    const uploadFeature = () => {
        const editComponent = bundleComponent(componentLoader, COMPONENT_NAME, 'SlugEdit.tsx')
        return buildFeature({
            properties: {
                [key]: {
                    isVisible: { show: false, edit: true, list: false, filter: false },
                    components: {
                        edit: editComponent,
                    },
                },
            },
        })
    }

    return uploadFeature()
}

export default SlugFeature