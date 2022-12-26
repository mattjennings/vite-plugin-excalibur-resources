import { Sound } from 'excalibur'

export default {
  load: (url) => new Sound(url),
  extensions: ['mp3', 'ogg', 'wav'],
}
