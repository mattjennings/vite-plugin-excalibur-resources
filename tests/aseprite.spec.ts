vi.mock('@excaliburjs/plugin-aseprite', () => ({
  AsepriteResource: vi.fn(),
}))
vi.mock('@excaliburjs/plugin-tiled', () => ({
  TiledMapResource: vi.fn(),
}))
vi.mock('excalibur', () => ({}))

import { AsepriteResource } from '@excaliburjs/plugin-aseprite'

// because $res converts to imports, we can't clear mocks between tests
// as each import will have already called new XYZResource(). so if a test
// needs to check for constructor arguments, it should get the last mock call instead
function getLastCall(mock: any): any[] {
  return mock.mock.calls[0]
}
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
