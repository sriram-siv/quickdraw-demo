import { node, hasUpdated } from '../scripts/draw.js'
import { board, info } from './components.js'
import pauseMenu from './pauseMenu.js'

export const game = (state, deps) => {
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