import { AsepriteResource } from '@excaliburjs/plugin-aseprite'

export default {
  load: (url: string, options?: { bustCache?: boolean }) => AsepriteResource,
}

declare module '../types' {
  interface Resources {
    aseprite: {
      type: AsepriteResource
      extensions: 'ase' | 'aseprite'
      options: { bustCache?: boolean }
    }
  }
}
