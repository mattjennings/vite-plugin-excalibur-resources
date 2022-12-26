import qs from 'query-string'
import dedent from 'dedent'
import recast from 'recast'
import tsParser from 'recast/parsers/typescript.js'
import fg from 'fast-glob'
import { generateTypes } from './generate-types.js'

const DEFAULT_LOADERS = {
  image: 'vite-plugin-excalibur-resources/loaders/image',
  sound: 'vite-plugin-excalibur-resources/loaders/sound',
  tiled: 'vite-plugin-excalibur-resources/loaders/tiled',
  aseprite: 'vite-plugin-excalibur-resources/loaders/aseprite',
}

const virtualLoadersModuleId = 'virtual:resource-loaders'
const resolvedVirtualLoadersModuleId = '\0' + virtualLoadersModuleId

/**
 * @param {import('./index').ResourcesPluginOptions} options
 * @returns {import('vite').Plugin}
 */
export default function resources(options = {}) {
  const isResource = (id) => {
    const [, params] = id.split('?')
    const query = qs.parse('?' + params)

    return !('url' in query) && id.startsWith('$res')
  }

  let publicPath
  return {
    name: 'vite-plugin-import-excalibur-resource',
    enforce: 'pre',
    configResolved(config) {
      publicPath = config.publicDir
    },
    resolveId(id) {
      if (isResource(id)) {
        return id
      }

      if (id === virtualLoadersModuleId) {
        return resolvedVirtualLoadersModuleId
      }
    },
    load(id) {
      if (id === resolvedVirtualLoadersModuleId) {
        return dedent(/* js */ `
          import defaultLoaders from 'vite-plugin-excalibur-resources/loaders'
          ${
            options.loaders
              ? `import customLoaders from '${options.loaders}'`
              : 'const customLoaders = {}'
          }

          export default {
            ...defaultLoaders,
            ...customLoaders
          }
        `)
      } else {
        const [res, params] = id.split('?')
        const query = params ? qs.parse('?' + params) : {}

        if (isResource(id)) {
          const options = query.options
            ? JSON.parse(decodeURIComponent(query.options))
            : {}

          return dedent(/* js */ `
          import { addResourceByUrl } from 'vite-plugin-excalibur-resources/runtime'
                    
          const resource = addResourceByUrl(${JSON.stringify(
            res.replace('$res', '/res')
          )}, ${JSON.stringify(options)})
          export default resource
        `)
        }
      }
    },
    // transform $res('/path/to/resource') to imports
    transform(code, id, options) {
      if (id.includes('node_modules')) {
        return
      }

      const tsAst = recast.parse(code, {
        parser: {
          parse: tsParser.parse,
        },
        sourceFileName: id,
      })

      let count = 0
      recast.visit(tsAst, {
        visitCallExpression(path) {
          const name = path.node.callee.name

          if (name === '$res') {
            const [importArg, optionsArg] = path.node.arguments

            // validate first argument is a string
            if (!recast.types.namedTypes.StringLiteral.check(importArg)) {
              throw new InvalidResError('path must be a string')
            }

            let options = {}
            // validate second argument is an object
            if (optionsArg) {
              if (!recast.types.namedTypes.ObjectExpression.check(optionsArg)) {
                throw new InvalidResError('options must be an object')
              }

              options = parseObjectExpression(optionsArg)
            }

            const b = recast.types.builders

            // sort keys so that import path has a consistent param order for caching reasons
            options = sortObjectKeys(options)

            const varName = `__res_${++count}`
            let source = Object.keys(options).length
              ? `$res/${importArg.value}?options=${encodeURIComponent(
                  JSON.stringify(options)
                )}`
              : `$res/${importArg.value}`

            if (source.includes('.json?')) {
              source = source.replace('.json?', '.json?raw&')
            }

            // replace $res with variable
            path.replace(b.identifier(varName))

            // add import statement
            tsAst.program.body.unshift(
              b.importDeclaration(
                [b.importDefaultSpecifier(b.identifier(varName))],
                b.literal(source)
              )
            )
          }
          this.traverse(path)
        },
      })

      if (count > 0) {
        return recast.print(tsAst, {
          sourceMapName: `${id}.map`,
        })
      }
    },
    async buildStart() {
      const files = await fg(['public/res/**/*'])
      for (let file of files) {
        this.addWatchFile(file)
      }
      generateTypes(publicPath)
    },
    handleHotUpdate(ctx) {
      if (ctx.file.includes('/public/res')) {
        generateTypes(publicPath)
      }
    },
  }
}

function parseObjectExpression(node) {
  const obj = {}
  for (const prop of node.properties) {
    const name = prop.key.name
    recast.visit(prop, {
      visitObjectExpression(path) {
        obj[name] = parseObjectExpression(path.node)
        return false
      },
      visitLiteral(path) {
        obj[name] = path.value.value
        return false
      },
    })
  }
  return obj
}

class InvalidResError extends Error {
  constructor(message) {
    message = `Invalid $res: ${message}`
    super(message)
    this.name = 'InvalidResError'
  }
}

function sortObjectKeys(obj) {
  const keys = Object.keys(obj)
  keys.sort()
  return keys.reduce((acc, key) => {
    acc[key] = obj[key]
    return acc
  }, {})
}
