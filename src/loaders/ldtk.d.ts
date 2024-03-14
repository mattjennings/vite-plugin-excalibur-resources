import { LdtkResource, LdtkResourceOptions } from '@excaliburjs/plugin-ldtk'

export default {
  load: (url: string, options: LdtkResourceOptions) => LdtkResource,
  extensions: ['ldtk'],
}

declare module '../types' {
  interface Resources {
    ldtk: {
      type: LdtkResource
      extensions: 'ldtk'
      options: LdtkResourceOptions
    }
  }
}
