import aseprite from '../src/loaders/aseprite'
import tiled from '../src/loaders/tiled'

export class CustomResource {
  path: string
  options: any

  constructor(path: string, options: any) {
    this.path = path
    this.options = options
  }
}

export default {
  aseprite,
  tiled,
  // custom: {
  //   load: (path: string, options: any) => {
  //     return new CustomResource(path, options)
  //   },
  //   extensions: ['custom'],
  // },
}

declare module '../src/types' {
  interface Resource {
    custom: {
      type: CustomResource
      extensions: 'custom'
      options: {
        foo?: string
      }
    }
  }
}
