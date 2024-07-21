import { TiledResource, TiledResourceOptions } from '@excaliburjs/plugin-tiled'

export default {
  load: (url: string, options: TiledResourceOptions) => TiledResource,
  extensions: ['tmx'],
}

declare module '../types' {
  interface Resources {
    tiled: {
      type: TiledResource
      extensions: 'tmx'
      options: TiledResourceOptions
    }
  }
}
