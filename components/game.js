import { node, hasUpdated } from '../scripts/draw.js'
import { board, info, pauseMenu } from '../scripts/components.js'

export const game = state => {
  if (!hasUpdated(state, Object.keys(state.now))) {
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