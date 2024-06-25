import * as path from "path";
import { fileURLToPath } from "url";

import { ComponentLoader } from "adminjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const bundle = (
  componentLoader: ComponentLoader,
  componentName: string,
): string => {
  componentLoader.add(
    componentName,
    path.join(__dirname, `components/${componentName}`),
  );

  return componentName;
};
