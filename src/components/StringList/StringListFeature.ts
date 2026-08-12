import { buildFeature, ComponentLoader, FeatureType } from "adminjs";
import { bundleComponent } from "../../utils/bundle-component.js";

export type StringListOptions = {
  componentLoader?: ComponentLoader;
  key: string;
  /** Delimiter used when storing values in the DB (default: `|`). */
  separator?: string;
  /**
   * Max visible characters in the **list** view before the `...` spoiler
   * (default: `80`). Display join is always `", "` regardless of `separator`.
   */
  listMaxLength?: number;
};

const COMPONENT_NAME = "StringList";
const DEFAULT_LIST_MAX_LENGTH = 80;

export const StringListFeature = (config: StringListOptions): FeatureType => {
  const {
    componentLoader,
    key,
    separator,
    listMaxLength = DEFAULT_LIST_MAX_LENGTH,
  } = config;

  const editComponent = bundleComponent(
    componentLoader,
    COMPONENT_NAME,
    "StringList.js",
  );
  const showComponent = bundleComponent(
    componentLoader,
    COMPONENT_NAME,
    "StringListShow.js",
  );
  const listComponent = bundleComponent(
    componentLoader,
    COMPONENT_NAME,
    "StringListList.js",
  );

  return buildFeature({
    properties: {
      [key]: {
        isVisible: { filter: true, show: true, edit: true, list: true },
        props: {
          ...(separator ? { stringListSeparator: separator } : {}),
          listMaxLength,
        },
        custom: {
          listMaxLength,
        },
        components: {
          edit: editComponent,
          show: showComponent,
          list: listComponent,
        },
      },
    },
  });
};

export default StringListFeature;
