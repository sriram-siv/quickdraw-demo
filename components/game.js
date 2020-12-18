import { node, hasUpdated } from '../~quickdraw/draw.js'
import { board, info } from './components.js'
import pauseMenu from './pauseMenu.js'

const game = (state, deps) => {
  if (!hasUpdated(state, deps)) {
    return document.querySelector('.game')
  }

  return node(
    { className: 'game' },
    [
      board(state, ['screen', 'cells', 'newLines']),
      info(state, ['screen', 'lines', 'score', 'nextPiece', 'holdPiece']),
      pauseMenu(state, ['timer'])
    ]
  )
}

export default game