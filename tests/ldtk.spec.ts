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

import { LdtkResource } from '@excaliburjs/plugin-ldtk'

// because $res converts to imports, we can't clear mocks between tests
// as each import will have already called new XYZResource(). so if a test
// needs to check for constructor arguments, it should get the last mock call instead
function getLastCall(mock: any): any[] {
  return mock.mock.calls[0]
}

describe('tiled', () => {
  test('tmx', () => {
    expect($res('top-down.ldtk')).toBeInstanceOf(LdtkResource)
  })

  test('json', () => {
    expect($res('file.json', { as: 'ldtk' })).toBeInstanceOf(LdtkResource)
  })

  test('with options', () => {
    expect(
      $res('file.json', {
        as: 'ldtk',
        useExcaliburWiring: false,
      })
    ).toBeInstanceOf(LdtkResource)
    const lastCall = getLastCall(LdtkResource)
    expect(lastCall[0]).toBe('/res/file.json')
    expect(lastCall[1]).toStrictEqual({
      useExcaliburWiring: false,
    })
  })
})
