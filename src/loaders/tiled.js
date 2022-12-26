import { TiledMapResource } from '@excaliburjs/plugin-tiled'

export default {
  load: (url, options) => {
    const resource = new TiledMapResource(url, options)

    return resource
  },
  extensions: ['tmx'],
}
