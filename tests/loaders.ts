export class CustomResource {
  path: string
  options: any

  constructor(path: string, options: any) {
    this.path = path
    this.options = options
  }
}

export default {
  custom: {
    load: (path: string, options: any) => {
      return new CustomResource(path, options)
    },
    extensions: ['custom'],
  },
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
