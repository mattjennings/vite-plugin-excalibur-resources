/* eslint-disable no-empty */
import dedent from 'dedent'
import path from 'path'
import { posixify, walk } from './fs.js'
import { createRequire } from 'module'
import { existsSync, writeFileSync } from 'fs'
import { resolve } from 'resolve.exports'

const require = createRequire(import.meta.url)

const getPackageEntry = (name) => {
  const p = require.resolve(name)
  return p.substring(0, p.lastIndexOf(name + '/') + name.length)
}

const packagePaths = {
  pluginAseprite: getPackageEntry('@excaliburjs/plugin-aseprite'),
  pluginTiled: getPackageEntry('@excaliburjs/plugin-tiled'),
  resources: getPackageEntry('vite-plugin-excalibur-resources'),
}

export function generateTypes(cwd) {
  const resPath = posixify(path.relative(cwd, 'public/res'))

  const files = existsSync(resPath)
    ? walk(resPath).map((path) => path.split(resPath + '/').pop())
    : []

  function getResourceType(file) {
    const images = ['png', 'jpg', 'jpeg', 'gif']
    const audio = ['mp3', 'ogg', 'wav']
    const tilesets = ['tmx']

    if (images.some((ext) => file.endsWith(ext))) {
      return 'image'
    }

    if (audio.some((ext) => file.endsWith(ext))) {
      return 'sound'
    }

    if (tilesets.some((ext) => file.endsWith(ext))) {
      return 'tiled'
    }
  }

  const types = dedent(/* ts */ `
    import * as ex from 'excalibur'

    declare namespace ExcaliburResources {
      interface ResourceType {
        image: ex.ImageSource
        sound: ex.Sound
        tiled: import("${packagePaths.pluginTiled}").TiledMapResource
        aseprite: import("${packagePaths.pluginAseprite}").AsepriteResource
        unknown: ex.Resource<unknown>
      }

      interface ResourceOptions {
        image: {
          bustCache?: boolean
          filtering?: ex.ImageFiltering
        }
        tiled: import("${packagePaths.pluginTiled}").TiledMapOptions    
        aseprite: { bustCache?: boolean }
      }

      interface Resource {
${files
  .map((file) => {
    const type = getResourceType(file)
    return `\t${JSON.stringify(file)}: ${JSON.stringify(type ?? 'unknown')}`
  })
  .join('\n')}
      }
    }
    
    declare global {
      export function $res<
        T extends keyof ExcaliburResources.Resource,
        As extends keyof ExcaliburResources.ResourceType = ExcaliburResources.Resource[T]
      >(path: T, options?: {
          as?: As
        } & (As extends keyof ExcaliburResources.ResourceOptions ? ExcaliburResources.ResourceOptions[As] : {})): ExcaliburResources.ResourceType[As]
    }
  `)

  writeFileSync(
    path.join(packagePaths.resources, 'src/types.d.ts'),
    types,
    'utf-8'
  )
}
