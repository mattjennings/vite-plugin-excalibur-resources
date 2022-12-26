import { ImageSource } from 'excalibur'

export default {
  load: (url, options) =>
    new ImageSource(url, options.bustCache, options.filtering),
  extensions: ['png', 'jpg', 'jpeg', 'gif', 'webp'],
}
