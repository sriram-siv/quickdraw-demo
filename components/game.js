import { node, hasUpdated } from '../~quickdraw/draw.js'
import Board from './Board.js'
import Info from './Info.js'
import PauseMenu from './PauseMenu.js'

import state from '../scripts/config.js'

const Game = (_, deps) => {
  if (!hasUpdated(state, deps)) {
    return document.querySelector('.game')
  }

  // ~4.5ms just to render this node
  // ~1.5ms without the dependencies..
  
  return node(
    { className: 'game' },
    [
      Board(state, ['screen', 'cells', 'newLines']),
      Info(state, ['screen', 'lines', 'score', 'nextPiece', 'holdPiece']),
      PauseMenu(state, ['timer'])
    ]
  )
}

export default Game