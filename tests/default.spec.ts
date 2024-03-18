vi.mock('@excaliburjs/plugin-aseprite', () => ({}))
vi.mock('@excaliburjs/plugin-tiled', () => ({}))
vi.mock('@excaliburjs/plugin-ldtk', () => ({}))
vi.mock('excalibur', () => ({
  ImageSource: vi.fn(),
  Sound: vi.fn(),
  FontSource: vi.fn(),
}))

import { FontSource, ImageSource, Sound } from 'excalibur'

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

describe('font', () => {
  test('woff', () => {
    expect($res('font.woff')).toBeInstanceOf(FontSource)
  })

  test('woff2', () => {
    expect($res('font.woff2')).toBeInstanceOf(FontSource)
  })

  test('with as', () => {
    expect($res('block.png', { as: 'font', family: 'abc' })).toBeInstanceOf(
      FontSource
    )
  })

  test('with options', () => {
    expect(
      $res('font.woff', { family: 'abc', color: 'blue' as any })
    ).toBeInstanceOf(FontSource)
    const lastCall = getLastCall(FontSource)

    expect(lastCall[0]).toBe('/res/font.woff')
    expect(lastCall[1]).toBe('abc')
    expect(lastCall[2]).toEqual({ color: 'blue' })
  })
})
