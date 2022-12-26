import { AsepriteResource } from '@excaliburjs/plugin-aseprite'

export default {
  load: (url, options) => new AsepriteResource(url, options.bustCache),
}
