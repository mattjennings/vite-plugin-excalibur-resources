# vite-plugin-excalibur-resources

Automatically loads your resources for [Excalibur](https://excaliburjs.com/) games. All of the Excalibur resource types are supported as well as Tiled and Aseprite, with some configuration.

```js
// equivalent to ex.ImageSource('/res/player.png')
const sprite = $res('player.png').toSprite()
actor.graphics.use(sprite)

// resource can safely be used from $res inline, no need to store in a variable
$res('jump.mp3').play()
```

It even has full typescript support for your files

![autocomplete](./assets/autocomplete.gif)

## Installation

```bash
npm install vite-plugin-excalibur-resources @excaliburjs/plugin-aseprite @excaliburjs/plugin-tiled
```

Add the plugin to your Vite config

```js
// vite.config.js
import { defineConfig } from 'vite'
import resources from 'vite-plugin-excalibur-resources'

export default defineConfig({
  plugins: [resources()],
})
```

## Usage

Create a `public/res` folder. All of your resources must be under this folder.

```
public
└── res
    ├── myimage.png
    └── mysound.mp3
```

Create a loader that will load the resources created from `$res`

```js
import { resources } from 'vite-plugin-excalibur-resources/runtime'

const loader = new Loader(resources)

engine.start(loader)
```

Use `$res` to load resources

```js
const sprite = new ex.Sprite({
  image: $res('myimage.png'),
})
```

## Typescript

You can get proper typing and autocompletion for your resources by updating your tsconfig.json like so:

```json
{
  "compilerOptions": {
    "types": ["vite-plugin-excalibur-resources/types"]
  }
}
```

**Note** these types are generated when you start your dev server or build your project. If you notice them not updating during development (i.e missing files), try restarting your server.

## Overriding resource type

By default a resource is determined by its file extension. However, extensions are not always 1-to-1 to a resource (for example, JSON could be used for many different resources). You can override the resource type by using the `as` option.

(The Aseprite loader will actually require you to provide `as` to work because it uses JSON)

```js
$res('/player.json', { as: 'aseprite' })
$res('/tileset.json', { as: 'tiled' })
```

## Custom resource loader

You can add your own resource types by providing a `loaders` option. This is a path to a file that exports

```js
import { defineConfig } from 'vite'
import resources from 'vite-plugin-excalibur-resources'

export default defineConfig({
  plugins: [
    resources({
      loaders: '/src/loaders.ts',
    }),
  ],
})
```

Here's an example that adds a custom resource type that loads a `.ctm` file.

```ts
// src/loaders.ts
export default {
  // name of your resource. this is used for `as`
  custom: {
    load: (path, options) => {
      // your custom resource class, see https://excaliburjs.com/docs/api/edge/classes/Resource.html
      // this is what will be passed to the Excalibur Loader
      return new CustomResource(path, options)
    },
    // optional - extensions to match for this loader when `as` is not specified
    extension: ['ctm'],
  },
}

// if you're using typescript, this will update $res for your custom resource type
declare module 'vite-plugin-excalibur-resources/types' {
  interface Resources {
    custom: {
      type: CustomResource

      // optional
      options: {
        foo?: string
      }

      // optional
      extensions: 'ctm' // | 'other' | 'extensions'
    }
  }
}

// usage
const custom = $res('/model.ctm')

// force a .json file to use your custom loader
const custom = $res('/model.json', { as: 'custom' })
```

## Aseprite / Tiled

I've provided optional loaders for Aseprite and Tiled. You can import and add them to a [custom loader])(#custom-resource-loader).

```ts
// src/loaders.ts
import aseprite from 'vite-plugin-excalibur-resources/loaders/aseprite'
import tiled from 'vite-plugin-excalibur-resources/loaders/tiled'

export default {
  aseprite,
  tiled,
}
```
