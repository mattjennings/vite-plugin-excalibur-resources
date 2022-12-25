import fs from 'fs'
import path from 'path'

/**
 *
 * @param {string} cwd
 * @param {{ dirs?: boolean; dot?: boolean }} opts
 * @returns
 */
export function walk(cwd, { dirs, dot } = {}) {
  const all_files = []

  function walk_dir(dir) {
    const files = fs.readdirSync(path.join(cwd, dir))

    for (const file of files) {
      if (!dot && file[0] === '.') continue

      const joined = path.join(dir, file)
      const stats = fs.statSync(path.join(cwd, joined))
      if (stats.isDirectory()) {
        if (dirs) all_files.push(joined)
        walk_dir(joined)
      } else {
        all_files.push(joined)
      }
    }
  }

  return walk_dir(''), all_files
}

export function posixify(str) {
  return str.replace(/\\/g, '/')
}
