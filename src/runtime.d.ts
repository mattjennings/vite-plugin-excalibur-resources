export const resources: any[]

export function addResourceLoader<Options extends { as?: string }>(
  type: string,
  options: {
    load: (
      url: string,
      options?: Options
    ) => import('excalibur').Loadable<unknown>
    extensions?: string[]
  }
)
