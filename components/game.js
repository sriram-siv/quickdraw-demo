import { node, hasUpdated } from '../~quickdraw/draw.js'
// import Board from './Board.js'
import Board from './Board2.js'
import Info from './Info.js'
import PauseMenu from './PauseMenu.js'

import state from '../scripts/config.js'

const Game = (_, deps) => {
  if (!hasUpdated(state, deps)) {
    return document.querySelector('.game')
  }

  // ~4.5ms just to render this node
  // ~1.5ms without the dependencies..
  // node(
  //   { className: 'game' },
  //   [
  //     Board(state, []),
  //     Info(state, []),
  //     PauseMenu(state, [])
  //   ]
  // )
      
  // const t0 = performance.now()
  const board = Board(state, ['screen', 'cells', 'newLines'])
  // console.log(performance.now() - t0)
  
  return node(
    { className: 'game' },
    [
      board,
      // Board(state, ['screen', 'cells', 'newLines']),
      Info(state, ['screen', 'lines', 'score', 'nextPiece', 'holdPiece']),
      PauseMenu(state, ['timer'])
    ]
  )
}

export default Game