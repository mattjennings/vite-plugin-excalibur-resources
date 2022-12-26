interface Resources {}
interface Files {}

type Extensions = Resources[keyof Resources]['extensions']

type ResourceByExtension = {
  [E in Extensions]: {
    [K in keyof Resources]: E extends Resources[K]['extensions'] ? K : never
  }[keyof Resources]
}

declare global {
  export function $res<
    T extends keyof Files,
    As extends keyof Resources = Files[T]
  >(
    path: T,
    options?: {
      as?: As
    } & (As extends keyof Resources ? Resources[As]['options'] : {})
  ): Resources[As]['type']
}
