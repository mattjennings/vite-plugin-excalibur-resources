import dedent from 'dedent'
import path from 'path'
import { posixify, walk } from './fs.js'
import { createRequire } from 'module'
import { existsSync, writeFileSync } from 'fs'

const require = createRequire(import.meta.url)

const getPackageEntry = (name) => {
  const p = require.resolve(name)
  return p.substring(0, p.lastIndexOf(name + '/') + name.length)
}

export function generateTypes(publicPath) {
  const resPath = posixify(path.join(publicPath, 'res'))

  const files = existsSync(resPath)
    ? walk(resPath).map((path) => path.split(resPath + '/').pop())
    : []

  const types = dedent(/* ts */ `
      import * as ex from 'excalibur'
          
      interface Resource {
        image: {
          type: ex.ImageSource
          extensions: 'png' | 'jpg' | 'jpeg' | 'gif' | 'webp'
          options:{
            bustCache?: boolean
            filtering?: ex.ImageFiltering
          } 
        }

        sound: {
          type: ex.Sound
          extensions: 'mp3' | 'ogg' | 'wav'
          options: {}
        }
      }

      type Extensions = Resource[keyof Resource]['extensions']

      
      type ResourceByExtension = {
        [E in Extensions]: {
          [K in keyof Resource]: E extends Resource[K]['extensions'] ? K : never
        }[keyof Resource]
      }


      interface Files {
  ${files
    .map((file) => {
      const extension = path.extname(file)
      return `\t${JSON.stringify(
        file
      )}: ResourceByExtension['${extension.substring(1)}']`
    })
    .join('\n')}
      }
    
   declare global { 
    export function $res<
      T extends keyof Files,
      As extends keyof Resource = Files[T]
    >(
      path: T,
      options?: {
        as?: As
      } & (As extends keyof Resource ? Resource[As]['options'] : {})
    ): Resource[As]['type']
   }
  `)

  writeFileSync(
    path.join(
      getPackageEntry('vite-plugin-excalibur-resources'),
      'src/types.d.ts'
    ),
    types,
    'utf-8'
  )
}
