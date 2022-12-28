#!/usr/bin/env node

import { resolveConfig } from 'vite'
import { generateTypes } from '../src/generate-types.js'

const { publicDir } = await resolveConfig({}, 'build', 'production')

// get first argument
const arg = process.argv[2]

if (arg === 'generate') {
  generateTypes(publicDir)
  console.log(`Generated types for resources in ${publicDir}`)
}
