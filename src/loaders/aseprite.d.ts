import { AsepriteResource } from '@excaliburjs/plugin-aseprite'

export default {
  load: (url: string, options?: { bustCache?: boolean }) => AsepriteResource,
}

declare module '../types' {
  interface Resource {
    aseprite: {
      type: AsepriteResource
      options: { bustCache?: boolean }
    }
  }
}
