import * as ex from 'excalibur'
import Level from './level'
import { resources } from 'vite-plugin-excalibur-resources/runtime'
import { Loader } from 'excalibur'

const engine = new ex.Engine({
  backgroundColor: ex.Color.fromHex('#5fcde4'),
  width: 600,
  height: 400,
  fixedUpdateFps: 60,
  // Turn off anti-aliasing for pixel art graphics
  antialiasing: false,
})

// Set global gravity, 800 pixels/sec^2
ex.Physics.acc = new ex.Vector(0, 800)

// Setup first level as a custom scene

const level = new Level()
engine.add('level', level)
engine.goToScene('level')

// Game events to handle
engine.on('hidden', () => {
  console.log('pause')
  engine.stop()
})
engine.on('visible', () => {
  console.log('start')
  engine.start()
})

const loader = new Loader(resources)
// Start the engine
engine.start(loader).then(() => {
  console.log('game start')
})
