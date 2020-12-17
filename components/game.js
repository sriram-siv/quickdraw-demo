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
      board(state, ['cells', 'newLines']),
      info(state, ['lines', 'score', 'nextPiece', 'holdPiece']),
      pauseMenu(state, ['timer'])
    ]
  )
}