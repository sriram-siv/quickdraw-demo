import {
  getRandomBlock,
  generateController,
  startInterval,
  findCompleteLines,
  removeLines,
  checkMoveIsValid,
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
} from './functions.js'

import {
  board,
  preview,
  playerData
} from './components.js'

import {
  draw
} from './draw.js'

const init = () => {


  // TODO
  // cells init { val: 0, color: ### }
  // Could have a debug setting that allows for variable length history
  // Fix flashing
  // Rename functions.js to logic.js

  const children = [
    { component: board, deps: ['cells'] },
    { component: playerData, deps: ['lines', 'score'] },
    { component: preview, deps: ['nextPiece'], args: { className: 'next', piece: 'nextPiece' } },
    { component: preview, deps: ['holdPiece'], args: { className: 'hold', piece: 'holdPiece' } }
  ]

  // useState = (initial, children) => {
  //   let state = [
  //     {},
  //     initial
  //   ]
  //   return [
  //     () => state,
  //     next => {
  //       state = [...state.slice(1), Object.assign(state[1], next)]
  //       state[1].ghostDistance = ghost(state[1].cells)
  //       draw(state, children)
  //     }
  //   ]
  // }

  // const [state, setState] = useState(
  //   initState,
  //   children
  // )

  const state = [
    {},
    {
      cells: Array.from({ length: 210 }, () => 0),
      fallingPosition: 4,
      fallingPiece: getRandomBlock(),
      nextPiece: getRandomBlock(),
      holdPiece: null,
      lines: 0,
      score: 0,
      newLines: [],
      timer: null
    }
  ]

  const controller = generateController()
  const keyBindings = {
    ArrowLeft: [-1, 100, move],
    ArrowRight: [1, 100, move],
    ArrowDown: [10, 100, move],
    ArrowUp: [null, 1000,
      () => alterCells(1, 2, move(ghost(state[1].cells), state[1]))],
    z: [-1, 200, rotate],
    x: [1, 200, rotate],
    Shift: [null, 500, hold],
    Escape: [null, 1000, () => setState(pause(gameLoop, state[1]))]
  } 

  const setState = newState => {
    state[0] = { ...state[1] }
    state[1] = Object.assign(state[1], newState)

    draw(state, children)
  }


  const gameLoop = () => {

    if (checkMoveIsValid(10, state[1].cells)) {
      setState((move(10, state[1])))
      return
    }
    
    setState(placePiece(spawnBlock(findCompleteLines(alterCells(1, 2, state[1])))))

    flashLines(state[1], [])(() => {
      // Executes using a timeout function returned from flashLines that waits for animation to finish
      // Pause-unpause triggers possible level speed increase
      // Bug caused by setting the value of prevState at start of timeout
      setState({
        ...pause(gameLoop, pause(gameLoop,
          removeLines(updateScore(state[1]))))
      })
    })
  }  

  draw(state, children) // initial draw
  setState(pause(gameLoop, state[1]))
  
  window.addEventListener('keyup', ({ key }) => {
    clearInterval(controller.getKey(key))
    controller.setKey(key, null)
  })

  window.addEventListener('keydown', ({ key }) => {
    // Only allow unpause in paused state
    if (key !== 'Escape' && !state[1].timer) return
    
    if (!controller.getKey(key) && keyBindings[key]) {
      const [value, delay, action] = keyBindings[key]
      controller.setKey(key, startInterval(() => {
        setState(action(value, state[1]))
      }, delay))
    }
  })
}

window.addEventListener('DOMContentLoaded', init)