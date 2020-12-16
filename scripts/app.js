import {
  getBlock,
  generateController,
  findCompleteLines,
  removeLines,
  findOffset,
  placePiece,
  ghost,
  alterCells,
  move,
  rotate,
  hold,
  spawnBlock,
  pause,
  updateScore,
  controllerMoveValid
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

  const gameLoop = () => {
    if (findOffset(state[1].fallingPiece, 10, state[1]) === 0) {
      setState((move(10, state[1])))
      
      return
    }

    setState(findCompleteLines(alterCells(1, 2, state[1])))

    setTimeout(() => {
      setState({
        ...pause(gameLoop, pause(gameLoop, placePiece(spawnBlock(removeLines(updateScore(state[1])))))),
        newLines: []
      })
    }, 200)
  }

  const [state, setState] = useState(
    {
      cells: Array.from({ length: 210 }, () => ({ ...newCell })),
      fallingPosition: 4,
      fallingPiece: getBlock(),
      nextPiece: getBlock(),
      holdPiece: null,
      lines: 0,
      score: 0,
      newLines: [],
      timer: setInterval(gameLoop, 1000)
    },
    [
      { component: game }
    ]
  )

  const controller = generateController({
    ArrowLeft: [-1, 100, move],
    ArrowRight: [1, 100, move],
    ArrowDown: [10, 100, move],
    ArrowUp: [null, 1000,
      () => alterCells(1, 2, move(ghost(state[1]), state[1]))],
    z: [-1, 200, rotate],
    x: [1, 200, rotate],
    Shift: [null, 500, hold],
    Escape: [gameLoop, 1000, pause]
  })

  window.addEventListener('keyup', ({ key }) => {
    clearInterval(controller.get(key))
    controller.clear(key, null)
  })

  window.addEventListener('keydown', ({ key }) => {
    // Only allow unpause in paused state
    if (key !== 'Escape' && !state[1].timer) return
    
    if (!controller.get(key) && controller.bindings[key]) {
      const [value, delay, action] = controller.bindings[key]
      controller.set(key, () => {
        const newState = action(value, state[1])
        if (controllerMoveValid(state[1], newState)) {
          setState(newState)
        }
      }, delay)
    }
  })
}

window.addEventListener('DOMContentLoaded', init)