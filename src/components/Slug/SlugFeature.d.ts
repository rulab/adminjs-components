import { ComponentLoader, FeatureType } from "adminjs";
type SlugOptions = {
    componentLoader: ComponentLoader;
    key: string;
};
declare const SlugFeature: (config: SlugOptions) => FeatureType;
export default SlugFeature;
