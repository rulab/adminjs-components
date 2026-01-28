let defaultComponentLoader = null;
export const setComponentLoader = (loader) => {
  defaultComponentLoader = loader;
};
export const getComponentLoader = () => {
  if (!defaultComponentLoader) {
    throw new Error("ComponentLoader is not set. Call setComponentLoader(loader) before using features without explicit loader.");
  }
  return defaultComponentLoader;
};
