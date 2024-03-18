import { FontSource, ImageSource } from 'excalibur'
import { Sound } from 'excalibur'

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
  font: {
    load: (url, { family, ...options } = {}) =>
      new FontSource(url, family, options),
    extensions: ['ttf', 'woff', 'woff2', 'otf'],
  },
}
