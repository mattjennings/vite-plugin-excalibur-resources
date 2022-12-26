vi.mock('@excaliburjs/plugin-aseprite', () => ({
  AsepriteResource: vi.fn(),
}))
vi.mock('@excaliburjs/plugin-tiled', () => ({
  TiledMapResource: vi.fn(),
}))
vi.mock('excalibur', () => ({}))

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

import { CustomResource } from './loaders'

// because $res converts to imports, we can't clear mocks between tests
// as each import will have already called new XYZResource(). so if a test
// needs to check for constructor arguments, it should get the last mock call instead
function getLastCall(mock: any): any[] {
  return mock.mock.calls[0]
}

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
