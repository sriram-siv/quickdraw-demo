import * as quickdraw from '../~quickdraw/draw.js'
import Tetris from '../components/Tetris.js'
import { newCell } from './objects.js'

import {
  getBlock,
  ghost,
  alterCells,
  move,
  rotate,
  hold,
  pause,
  gameLoop,
  isMoveValid
} from './logic.js'

const state = quickdraw.initialize({
  app: Tetris,
  initial: {
    screen: 'title',
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
  // ControlKey: [value, delay, function]
  // All control functions are passed the value and current state 
  controls: {
    ArrowLeft: [-1, 100, (value, now) => isMoveValid(now, move(value, now))],
    ArrowRight: [1, 100, (value, now) => isMoveValid(now, move(value, now))],
    ArrowDown: [10, 100, (value, now) => isMoveValid(now, move(value, now))],
    ArrowUp: [null, 1000, (_, now) => alterCells(1, 2, move(ghost(now), now))],
    z: [-1, 200, rotate],
    x: [1, 200, rotate],
    Shift: [null, 500, hold],
    Escape: [() => gameLoop(state), 9999, pause]
  },
  // historyLength: 32, auto sets to infinite
  debugCallback: () => {
    clearInterval(state.now.timer)
    return ({ timer: null })
  }
})

export default state