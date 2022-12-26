interface ResourcesPluginOptions {
  loaders?: string
}
interface Loader {
  load: (path: string, ...args: any[]) => Promise<Buffer>
  extensions?: string[]
}

export default function resources(options?: ResourcesPluginOptions): Plugin
