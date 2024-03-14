import { TiledMapResource, TiledMapOptions } from '@excaliburjs/plugin-tiled'

export default {
  load: (url: string, options: TiledMapOptions) => TiledMapResource,
  extensions: ['tmx'],
}

declare module '../types' {
  interface Resources {
    tiled: {
      type: TiledMapResource
      extensions: 'tmx'
      options: TiledMapOptions
    }
  }
}
