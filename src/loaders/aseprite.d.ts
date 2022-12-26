import { AsepriteResource } from '@excaliburjs/plugin-aseprite'

export default {
  load: (url: string, options?: { bustCache?: boolean }) => AsepriteResource,
}

declare module '../index' {
  interface Resources {
    aseprite: {
      type: AsepriteResource
      options: { bustCache?: boolean }
    }
  }
}
