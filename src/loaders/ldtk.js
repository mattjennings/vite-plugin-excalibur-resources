import { LdtkResource } from '@excaliburjs/plugin-ldtk'

export default {
  load: (url, options) => {
    const resource = new LdtkResource(url, options)

    return resource
  },
  extensions: ['ldtk'],
}
