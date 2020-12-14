import {
  getBlock,
  generateController,
  startInterval,
  findCompleteLines,
  removeLines,
  findOffset,
  placePiece,
  ghost,
  alterCells,
  move,
  rotate,
  hold,
  flashLines,
  spawnBlock,
  pause,
  updateScore
} from './logic.js'

import {
  board,
  preview,
  playerData
} from './components.js'

import {
  useState
} from './draw.js'

const init = () => {
  // TODO
  // Could have a debug setting that allows for variable length history
  // Remove lines doesnt remember colors properly
  // Improve kicks

  const gameLoop = () => {
    if (findOffset(state[1].fallingPiece, 10, state[1]) === 0) {
      setState((move(10, state[1])))
      return
    }
    // Else
    setState(pause(gameLoop, findCompleteLines(alterCells(1, 2, state[1]))))
    flashLines(state)((nextState, speedUp) => {
      // Delayed function call returned from flashLines
      setState({
        ...pause(gameLoop, placePiece(spawnBlock(removeLines(updateScore(nextState)))), speedUp)
      })
    })
  }

  const [state, setState] = useState(
    {
      cells: Array.from({ length: 210 }, () => 0),
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
      { component: board, deps: ['cells'] },
      { component: playerData, deps: ['lines', 'score'] },
      { component: preview, deps: ['nextPiece'], args: { className: 'next', piece: 'nextPiece' } },
      { component: preview, deps: ['holdPiece'], args: { className: 'hold', piece: 'holdPiece' } }
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
    Escape: [null, 1000, () => setState(pause(gameLoop, state[1]))]
  })
  
  window.addEventListener('keyup', ({ key }) => {
    clearInterval(controller.getKey(key))
    controller.setKey(key, null)
  })

  window.addEventListener('keydown', ({ key }) => {
    // Only allow unpause in paused state
    if (key !== 'Escape' && !state[1].timer) return
    
    if (!controller.getKey(key) && controller.bindings[key]) {
      const [value, delay, action] = controller.bindings[key]
      controller.setKey(key, startInterval(() => {
        setState(action(value, state[1]))
      }, delay))
    }
  })
}

window.addEventListener('DOMContentLoaded', init)