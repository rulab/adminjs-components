import fs from 'fs'
import path from 'path'

const DIST_DIR = './dist'

function walk(dir, callback) {
    fs.readdirSync(dir, { withFileTypes: true }).forEach(dirent => {
        const fullPath = path.join(dir, dirent.name)
        if (dirent.isDirectory()) {
            walk(fullPath, callback)
        } else {
            callback(fullPath)
        }
    })
}

function isRelativeImport(importPath) {
    return importPath.startsWith('./') || importPath.startsWith('../')
}

function needsFix(importPath) {
    return (
        isRelativeImport(importPath) &&
        !importPath.endsWith('.js') &&
        !importPath.endsWith('.json') &&
        !importPath.endsWith('.css')
    )
}

function resolveImportAbsolutePath(currentFilePath, importPath) {
    const dir = path.dirname(currentFilePath)
    return path.resolve(dir, importPath)
}

function fixFileImports(filePath) {
    if (!filePath.endsWith('.js') && !filePath.endsWith('.mjs')) return

    let content = fs.readFileSync(filePath, 'utf-8')

    const pattern = /(import|export)\s.+?from\s+['"](.+?)['"]/g

    const fixedContent = content.replace(pattern, (match, keyword, importPath) => {
        if (!needsFix(importPath)) return match

        const absPath = resolveImportAbsolutePath(filePath, importPath)

        if (fs.existsSync(absPath + '.js')) {
            return match.replace(importPath, importPath + '.js')
        } else if (fs.existsSync(path.join(absPath, 'index.js'))) {
            return match.replace(importPath, importPath + '/index.js')
        }

        return match
    })

    if (fixedContent !== content) {
        fs.writeFileSync(filePath, fixedContent, 'utf-8')
        console.log(`[fix-imports] Fixed: ${filePath}`)
    }
}

walk(DIST_DIR, fixFileImports)