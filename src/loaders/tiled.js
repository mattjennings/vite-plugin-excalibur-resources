import { TiledResource } from '@excaliburjs/plugin-tiled'

export default {
  load: (url, options) => {
    const resource = new TiledResource(url, options)

    return resource
  },
  extensions: ['tmx'],
}
