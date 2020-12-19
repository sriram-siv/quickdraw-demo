import { node, hasUpdated } from '../~quickdraw/draw.js'
import { gameLoop, pause, getBlock } from '../scripts/logic.js'
import { newCell } from '../scripts/objects.js'

const PauseMenu = (state, deps) => {
  
  const className = 'pause-menu'
  if (!hasUpdated(state, deps)) {
    return document.querySelector(`.${className}`) || ''
  }

  const unpause = () => state.set(pause(() => gameLoop(state), state.now))

  const restart = () => {
    state.set({
      screen: 'game',
      cells: Array.from({ length: 210 }, () => ({ ...newCell })),
      fallingPosition: 4,
      fallingPiece: getBlock(),
      nextPiece: getBlock(),
      holdPiece: null,
      lines: 0,
      score: 0,
      newLines: [],
      timer: setInterval(() => gameLoop(state), 1000)
    })
  }

  const quit = () => {
    state.set(state.history[0])
  }

  return !state.now.timer
    ? node(
      { className },
      [
        node({ type: 'p', className: 'pause-title' }, ['PAUSED']),
        node({
          className: 'bezel',
          type: 'button',
          events: [['click', unpause]]
        },
        ['resume'],
        ),
        node({
          className: 'bezel',
          type: 'button',
          events: [['click', restart]]
        },
        ['restart'],
        ),
        node({
          className: 'bezel',
          type: 'button',
          events: [['click', quit]]
        },
        ['quit'],
        )
      ]
    )
    : ''
}

export default PauseMenu