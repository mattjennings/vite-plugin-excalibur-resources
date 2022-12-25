# vite-plugin-excalibur-resources

Automatically loads your resources for [Excalibur](https://excaliburjs.com/) games.

```js
// equivalent to ex.ImageSource(path)
const sprite = $res('/player.png').toSprite()
actor.graphics.use(sprite)

// resource can safely be used from $res inline, no need to store in a variable
$res('/jump.mp3').play()
```

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
const image = $res('./img/myimage.png')

const sprite = new ex.Sprite({
  image: image,
})
```

## Types

If you are using Typescript (or jsconfig.json), you can get autocompletion for your resources by updating your tsconfig.json like so:

```json
{
  "compilerOptions": {
    "types": ["vite-plugin-excalibur-resources/types"]
  }
}
```

## Changing asset type

By default, resource types are detected by their file extension. However some extensions are used for multiple kinds of asset types (such as JSON). You can specify the asset type by using the `as` keyword.

```js
const sprite = $res('/player.json', { as: 'aseprite' }).toSprite()
```

## Adding a custom resource loader

All of the [Excalibur resource types](https://excaliburjs.com/docs/imagesource/) are supported, as well as Tiled and Aseprite files.

You can add your own asset loaders by using the `addResourceLoader` function. This should be done as early as possible in your code, before any `$res` calls for that asset are made.

```ts
import { addResourceLoader } from 'vite-plugin-excalibur-resources/runtime'

addResourceLoader('custom', {
  load: (path, options) => {
    // your custom resource class, see https://excaliburjs.com/docs/api/edge/classes/Resource.html
    return new CustomResource(path, options)
  },
  // optional, extensions to match for this loader when `as` is not specified
  extension: ['ctm'],
})

const custom = $res('/model.ctm')

// force a .json file to use your custom loader
const custom = $res('/model.json', { as: 'custom' })

// if you're using Typescript, add this to get proper typing
declare namespace ExcaliburResources {
  interface ResourceType {
    custom: CustomResource
  }

  interface ResourceOptions {
    custom: {
      // your options
    }
  }
}
```
