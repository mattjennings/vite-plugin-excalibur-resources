vi.mock('@excaliburjs/plugin-aseprite', () => ({
  AsepriteResource: vi.fn(),
}))
vi.mock('@excaliburjs/plugin-tiled', () => ({
  TiledResource: vi.fn(),
}))
vi.mock('@excaliburjs/plugin-ldtk', () => ({
  LdtkResource: vi.fn(),
}))
vi.mock('excalibur', () => ({}))

import { TiledResource } from '@excaliburjs/plugin-tiled'

// because $res converts to imports, we can't clear mocks between tests
// as each import will have already called new XYZResource(). so if a test
// needs to check for constructor arguments, it should get the last mock call instead
function getLastCall(mock: any): any[] {
  return mock.mock.calls[0]
}

describe('tiled', () => {
  test('tmx', () => {
    expect($res('tilemap.tmx')).toBeInstanceOf(TiledResource)
  })

  test('json', () => {
    expect($res('file.json', { as: 'tiled' })).toBeInstanceOf(TiledResource)
  })

  test('with options', () => {
    expect(
      $res('file.json', {
        as: 'tiled',
        mapFormatOverride: 'TMX' as any,
        startZIndex: 10,
      })
    ).toBeInstanceOf(TiledResource)
    const lastCall = getLastCall(TiledResource)
    expect(lastCall[0]).toBe('/res/file.json')
    expect(lastCall[1]).toStrictEqual({
      mapFormatOverride: 'TMX',
      startZIndex: 10,
    })
  })
})
