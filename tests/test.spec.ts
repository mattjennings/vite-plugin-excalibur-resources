vi.mock('@excaliburjs/plugin-aseprite', () => ({
  AsepriteResource: vi.fn(),
}))
vi.mock('@excaliburjs/plugin-tiled', () => ({
  TiledMapResource: vi.fn(),
}))
vi.mock('excalibur', () => ({
  ImageSource: vi.fn(),
  Sound: vi.fn(),
}))

// there's a bug with vitest 0.26.2 where mocking ./loaders causes an infinite loop
// so this is basically re-implementing that module with a mock fn. it's simple anyways.
vi.mock('./loaders', async () => {
  const CustomResource = vi.fn()
  return {
    CustomResource,
    default: {
      custom: {
        load: (...args: any[]) => new CustomResource(...args),
        extensions: ['custom'],
      },
    },
  }
})

import { ImageSource, Sound } from 'excalibur'
import { AsepriteResource } from '@excaliburjs/plugin-aseprite'
import { TiledMapResource } from '@excaliburjs/plugin-tiled'
import { CustomResource } from './loaders'

// because $res converts to imports, we can't clear mocks between tests
// as each import will have already called new XYZResource(). so if a test
// needs to check for constructor arguments, it should get the last mock call instead
function getLastCall(mock: any): any[] {
  return mock.mock.calls[0]
}

describe('images', () => {
  test('png', () => {
    expect($res('block.png')).toBeInstanceOf(ImageSource)
  })

  test('jpg', () => {
    expect($res('block.jpg')).toBeInstanceOf(ImageSource)
  })

  test('jpeg', () => {
    expect($res('block.jpeg')).toBeInstanceOf(ImageSource)
  })

  test('gif', () => {
    expect($res('block.gif')).toBeInstanceOf(ImageSource)
  })

  test('webp', () => {
    expect($res('block.webp')).toBeInstanceOf(ImageSource)
  })

  test('with as', () => {
    expect($res('jump.wav', { as: 'image' })).toBeInstanceOf(ImageSource)
  })

  test('with options', () => {
    expect(
      $res('block.png', { bustCache: true, filtering: 'Blended' as any })
    ).toBeInstanceOf(ImageSource)
    const lastCall = getLastCall(ImageSource)
    expect(lastCall[0]).toBe('/res/block.png')
    expect(lastCall[1]).toBe(true)
    expect(lastCall[2]).toBe('Blended')
  })
})

describe('sound', () => {
  test('wav', () => {
    expect($res('jump.wav')).toBeInstanceOf(Sound)
  })

  test('mp3', () => {
    expect($res('jump.mp3')).toBeInstanceOf(Sound)
  })

  test('ogg', () => {
    expect($res('jump.ogg')).toBeInstanceOf(Sound)
  })

  test('with as', () => {
    expect($res('block.png', { as: 'sound' })).toBeInstanceOf(Sound)
  })
})

describe('aseprite', () => {
  test('json', () => {
    expect($res('file.json', { as: 'aseprite' })).toBeInstanceOf(
      AsepriteResource
    )
  })

  test('with options', () => {
    expect(
      $res('file.json', { as: 'aseprite', bustCache: true })
    ).toBeInstanceOf(AsepriteResource)
    const lastCall = getLastCall(AsepriteResource)
    expect(lastCall[0]).toBe('/res/file.json')
    expect(lastCall[1]).toBe(true)
  })
})

describe('tiled', () => {
  test('tmx', () => {
    expect($res('tilemap.tmx')).toBeInstanceOf(TiledMapResource)
  })

  test('json', () => {
    expect($res('file.json', { as: 'tiled' })).toBeInstanceOf(TiledMapResource)
  })

  test('with options', () => {
    expect(
      $res('file.json', {
        as: 'tiled',
        mapFormatOverride: 'TMX' as any,
        startingLayerZIndex: 10,
      })
    ).toBeInstanceOf(TiledMapResource)
    const lastCall = getLastCall(TiledMapResource)
    expect(lastCall[0]).toBe('/res/file.json')
    expect(lastCall[1]).toStrictEqual({
      mapFormatOverride: 'TMX',
      startingLayerZIndex: 10,
    })
  })
})

describe('custom loader', () => {
  test('with as', () => {
    expect($res('file.custom')).toBeInstanceOf(CustomResource)
  })

  test('with options', () => {
    expect($res('file.json', { as: 'custom', foo: 'bar' })).toBeInstanceOf(
      CustomResource
    )

    const lastCall = getLastCall(CustomResource)
    expect(lastCall[0]).toBe('/res/file.json')
    expect(lastCall[1]).toStrictEqual({ foo: 'bar' })
  })
})
