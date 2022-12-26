import { AsepriteResource } from '@excaliburjs/plugin-aseprite'
import { ImageSource } from 'excalibur'
import { Sound } from 'excalibur'
import { TiledMapResource } from '@excaliburjs/plugin-tiled'

export default {
  image: {
    load: (url, options) =>
      new ImageSource(url, options.bustCache, options.filtering),
    extensions: ['png', 'jpg', 'jpeg', 'gif', 'webp'],
  },
  sound: {
    load: (url) => new Sound(url),
    extensions: ['mp3', 'ogg', 'wav'],
  },
  aseprite: {
    load: (url, options) => new AsepriteResource(url, options.bustCache),
  },
  tiled: {
    load: (url, options) => {
      const resource = new TiledMapResource(url, options)

      return resource
    },
    extensions: ['tmx'],
  },
}
