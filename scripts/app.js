import * as quickdraw from '../~quickdraw/draw.js'
import { tetris } from '../components/tetris.js'
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

const init = () => {

  const state = quickdraw.initialize({
    app: tetris,
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
    controls: {
      ArrowLeft: [-1, 100, (value, current) => isMoveValid(current, move(value, current))],
      ArrowRight: [1, 100, (value, current) => isMoveValid(current, move(value, current))],
      ArrowDown: [10, 100, (value, current) => isMoveValid(current, move(value, current))],
      ArrowUp: [null, 1000,
        (_, now) => alterCells(1, 2, move(ghost(now), now))],
      z: [-1, 200, rotate],
      x: [1, 200, rotate],
      Shift: [null, 500, hold],
      Escape: [() => gameLoop(state), 1000, pause]
    },
    // historyLength: 32, auto sets to infinite
    debugOpts: {
      use: true,
      callback: () => {
        clearInterval(state.now.timer)
        state.set({ timer: null })
      }
    }
  })
}

window.addEventListener('DOMContentLoaded', init)