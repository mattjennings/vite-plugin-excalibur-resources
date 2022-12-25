import { AsepriteResource } from '@excaliburjs/plugin-aseprite'
import { TiledMapResource } from '@excaliburjs/plugin-tiled'
import { ImageSource, Sound } from 'excalibur'

const resourceLoaders = {
  image: {
    load: (url, options) =>
      new ImageSource(url, options.bustCache, options.filtering),
    extensions: ['png', 'jpg', 'jpeg', 'gif', 'webp'],
  },
  sound: {
    load: (url) => new Sound(url),
    extensions: ['mp3', 'ogg', 'wav'],
  },
  tiled: {
    load: (url, options) => {
      const resource = new TiledMapResource(url, {
        mapFormatOverride: options.mapFormatOverride,
        startingLayerZIndex: options.startingLayerZIndex,
      })

      return resource
    },
    extensions: ['tmx'],
  },
  aseprite: {
    load: (url, options) => new AsepriteResource(url, options.bustCache),
  },
}

export const resources = []

/**
 *
 * @param {string} url
 * @param {{ as?: string }} options
 * @returns
 */
export function addResourceByUrl(url, options) {
  let type
  if (url.startsWith('data:')) {
    const [, _type] = url.match(/^data:([^;]+);(base64)?,(.*)$/) || []
    if (_type) {
      type = _type.split('/')[1]
    } else {
      throw new Error(`Invalid data url: ${url}`)
    }
  } else {
    type = url.split('?')[0].split('.').pop()
  }
  const resourceLoader = options?.as
    ? resourceLoaders[options.as]
    : Object.values(resourceLoaders).find((loader) =>
        loader.extensions.includes(type)
      )

  if (resourceLoader) {
    const resource = resourceLoader.load(url, options ?? {})

    if (!resources.includes(resource)) {
      resources.push(resource)
    }

    return resource
  }

  throw new Error(`No loader found for .${type} file`)
}

/**
 * @template {{ as?: string }} Options
 * @param {string} type
 * @param {{ load: (url: string, options?: Options) => import('excalibur').Loadable<unknown>, extensions?: string[] }} args
 */
export function addResourceLoader(type, args) {
  Object.assign(resourceLoaders, {
    [type]: args,
  })
}
