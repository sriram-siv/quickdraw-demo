import { node, hasUpdated } from '../~quickdraw/draw.js'
import Board from './Board.js'
import Info from './Info.js'
import PauseMenu from './PauseMenu.js'

const Game = (state, deps) => {
  if (!hasUpdated(state, deps)) {
    return document.querySelector('.game')
  }

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