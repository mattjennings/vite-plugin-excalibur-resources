vi.mock('@excaliburjs/plugin-aseprite', () => ({
  AsepriteResource: vi.fn(),
}))
vi.mock('@excaliburjs/plugin-tiled', () => ({
  TiledMapResource: vi.fn(),
}))
vi.mock('@excaliburjs/plugin-ldtk', () => ({
  LdtkResource: vi.fn(),
}))
vi.mock('excalibur', () => ({}))

import { TiledMapResource } from '@excaliburjs/plugin-tiled'

// because $res converts to imports, we can't clear mocks between tests
// as each import will have already called new XYZResource(). so if a test
// needs to check for constructor arguments, it should get the last mock call instead
function getLastCall(mock: any): any[] {
  return mock.mock.calls[0]
}

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
