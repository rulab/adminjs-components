import path from 'path';
import * as url from 'url';
import { getComponentLoader } from './component-loader.js';
const dirname = url.fileURLToPath(new URL('.', import.meta.url));

export const bundleComponent = (loader, componentName, componentFile) => {
    const resolvedLoader = loader ?? getComponentLoader();
    const componentPath = path.join(dirname, '../components', componentName, componentFile);
    const componentId = componentFile.replace(/\.[^.]+$/, '');
    return resolvedLoader.add(componentId, componentPath);
};
