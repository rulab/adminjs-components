import type { ComponentLoader } from "adminjs";

let defaultComponentLoader: ComponentLoader | null = null;

export const setComponentLoader = (loader: ComponentLoader | unknown) => {
  defaultComponentLoader = loader as ComponentLoader;
};

export const getComponentLoader = (): ComponentLoader => {
  if (!defaultComponentLoader) {
    throw new Error(
      "ComponentLoader is not set. Call setComponentLoader(loader) before using features without explicit loader.",
    );
  }
  return defaultComponentLoader;
};
