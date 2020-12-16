import {
  getBlock,
  generateController,
  ghost,
  alterCells,
  move,
  rotate,
  hold,
  pause,
  controllerMoveValid,
  gameLoop
} from './logic.js'

import {
  game
} from './components.js'

import {
  useState
} from './draw.js'

import {
  newCell
} from './objects.js'

const init = () => {
  // TODO
  // Could have a debug setting that allows for variable length history
  // Improve kicks
  // Clear key timers on pause

  const state = useState(
    {
      cells: Array.from({ length: 210 }, () => ({ ...newCell })),
      fallingPosition: 4,
      fallingPiece: getBlock(),
      nextPiece: getBlock(),
      holdPiece: null,
      lines: 0,
      score: 0,
      newLines: [],
      timer: 0
    },
    game
  )

  state.set(pause(() => gameLoop(state), state.now))

  const controller = generateController({
    ArrowLeft: [-1, 100, move],
    ArrowRight: [1, 100, move],
    ArrowDown: [10, 100, move],
    ArrowUp: [null, 1000,
      (_, now) => alterCells(1, 2, move(ghost(now), now))],
    z: [-1, 200, rotate],
    x: [1, 200, rotate],
    Shift: [null, 500, hold],
    Escape: [() => gameLoop(state), 1000, pause]
  })

  window.addEventListener('keyup', ({ key }) => {
    clearInterval(controller.get(key))
    controller.clear(key, null)
  })

  window.addEventListener('keydown', ({ key }) => {
    // Only allow unpause in paused state
    if (key !== 'Escape' && !state.now.timer) return
    
    if (!controller.get(key) && controller.bindings[key]) {
      const [value, delay, action] = controller.bindings[key]

      controller.set(key, () => {
        const newState = action(value, state.now)
        if (controllerMoveValid(state.now, newState)) {
          state.set(newState)
        }
      }, delay)
    }
  })
}

window.addEventListener('DOMContentLoaded', init)