import { TiledMapResource } from '@excaliburjs/plugin-tiled'

export default {
  load: (url, options) => TiledMapResource,
  extensions: ['tmx'],
}

// for some reason, importing TiledMapOptions from plugin-tiled completely breaks typing of $res
interface TiledMapOptions {
  mapFormatOverride?: 'JSON' | 'TMX'
  startingLayerZIndex?: number
}

declare module '../types' {
  interface Resource {
    tiled: {
      type: TiledMapResource
      extensions: 'tmx'

      options: TiledMapOptions
    }
  }
}
