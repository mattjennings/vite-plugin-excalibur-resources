/// <reference types="./generated" />

interface Resources {}
interface Files {}

// get all Resources that have 'extensions' explicitly defined
type ResourcesWithExtensions = Pick<
  Resources,
  {
    [K in keyof Resources]: 'extensions' extends keyof Resources[K] ? K : never
  }[keyof Resources]
>

export type Extensions =
  ResourcesWithExtensions[keyof ResourcesWithExtensions]['extensions']

export type ResourceByExtension = {
  [E in Extensions]: {
    [K in keyof ResourcesWithExtensions]: E extends ResourcesWithExtensions[K]['extensions']
      ? K
      : never
  }[keyof ResourcesWithExtensions]
}

export interface ResourceLoader<Type, Options, Extensions> {
  type: Type
  options: Options
  extensions?: Extensions
}

declare global {
  export function $res<
    T extends keyof Files,
    As extends keyof Resources = Files[T]
  >(
    path: T,
    options?: {
      as?: As
    } & Resources[As]['options']
  ): Resources[As]['type']
}
