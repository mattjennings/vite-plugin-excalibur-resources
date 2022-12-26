import { AsepriteResource } from '@excaliburjs/plugin-aseprite'
import { TiledMapResource } from '@excaliburjs/plugin-tiled'
import { ImageSource, Sound } from 'excalibur'
import loaders from 'virtual:resource-loaders'

export const resources = []

/**
 *
 * @param {string} url
 * @param {{ as?: string }} options
 * @returns
 */
export function addResourceByUrl(url, options = {}) {
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
  const { as: _as, ...opts } = options ?? {}

  const loader = _as
    ? loaders[_as]
    : Object.values(loaders).find((loader) => loader.extensions?.includes(type))

  if (loader) {
    const resource = loader.load(url, opts)

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
export function addloader(type, args) {
  Object.assign(loaders, {
    [type]: args,
  })
}
