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

  const types = /* ts */ `\
import * as ex from 'excalibur'
import { ResourceByExtension } from './index'

declare module './types' {
  interface Resources {
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
    }
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
}`

  writeFileSync(
    path.join(
      getPackageEntry('vite-plugin-excalibur-resources'),
      'src/generated.d.ts'
    ),
    types,
    'utf-8'
  )
}
