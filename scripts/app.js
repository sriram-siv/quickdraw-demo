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
  updateScore,
  getPlacementMap
} from './logic.js'

import {
  board,
  info
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
      setState((move(10, state)))
      return
    }
    // Else
    // Working version
    // setState(pause(gameLoop, findCompleteLines(alterCells(1, 2, state[1]))))
    // flashLines(state)((nextState, speedUp) => {
    //   // Delayed function call returned from flashLines
    //   setState({
    //     ...pause(gameLoop, placePiece(spawnBlock(removeLines(updateScore(nextState)))), speedUp)
    //   })
    // })


    
    setState(pause(gameLoop,
      placePiece(spawnBlock(findCompleteLines(alterCells(1, 2, state[1]))))))
      
    // TODO Could be an issue here with allowing manual unpause inbetween flash states

    setTimeout(() => {
      setState({
        ...pause(gameLoop, removeLines(updateScore(state[1]))),
        newLines: []
      })
    }, 200)

    // if it works, can remove speedUp param from pause
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
      { component: board, deps: ['cells', 'newLines'] },
      { component: info, deps: [ 'lines', 'score', 'nextPiece', 'holdPiece'] }
    ]
  )

  const controllerMoveValid = (current, next) => {
    // newStates cells must be rechecked due to asynchronous call
    const placement = getPlacementMap(next.fallingPiece, next.fallingPosition)
    const outBounds = placement.some(i => i >= 210)
    const collision = placement.some(i => current.cells[i] === 2)
    const cloning = current.cells.every(cell => cell !== 1)
      && next.cells.some(cell => cell === 1)
    
    return !outBounds && !collision && !cloning
  }

  const controller = generateController({
    ArrowLeft: [-1, 100, move],
    ArrowRight: [1, 100, move],
    ArrowDown: [10, 100, move],
    ArrowUp: [null, 1000,
      () => alterCells(1, 2, move(ghost(state[1]), state))],
    z: [-1, 200, rotate],
    x: [1, 200, rotate],
    Shift: [null, 500, hold],
    Escape: [null, 1000, () => setState(pause(gameLoop, state[1]))]
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
        const newState = action(value, state)
        // pause doesnt return a value at the moment
        if (!newState) return
        if (controllerMoveValid(state[1], newState)) {
          setState(newState)
        }
      }, delay)
    }
  })
}

window.addEventListener('DOMContentLoaded', init)