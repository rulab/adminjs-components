import path from 'path'
import * as url from 'url'

import type { ComponentLoader } from 'adminjs'

const dirname = url.fileURLToPath(new URL('.', import.meta.url))

export const bundleComponent = (
    loader: ComponentLoader,
    componentName: string,
    componentFile: string,
) => {
    const componentPath = path.join( dirname,'../components',componentName,componentFile)
    console.log('[bundleComponent] Registering:', componentPath)
    return loader.add(componentFile, componentPath)
}