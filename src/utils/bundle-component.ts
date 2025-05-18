import path from 'path'
import * as url from 'url'
import { createRequire } from 'module'

import type { ComponentLoader } from 'adminjs'

const dirname = url.fileURLToPath(new URL('.', import.meta.url))
//const __filename = url.fileURLToPath(new URL('.', import.meta.url))
//const __dirname = path.dirname(__filename)
//const require = createRequire(import.meta.url)
//const basePath = path.dirname(require.resolve('@rulab/adminjs-components'))

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const bundleComponent = (
    loader: ComponentLoader,
    componentName: string,
    componentFile: string,
) => {
    const componentPath = path.join( dirname,'../src/components',componentName,componentFile)
    console.log('[bundleComponent] Registering:', componentPath)
    return loader.add(componentName, componentPath)
}