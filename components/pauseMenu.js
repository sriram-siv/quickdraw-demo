import { node, hasUpdated } from '../scripts/draw.js'
import { gameLoop, pause } from '../scripts/logic.js'

const pauseMenu = (state, deps) => {
  const className = 'pause-menu'
  if (!hasUpdated(state, deps)) {
    return document.querySelector(`.${className}`) || ''
  }

  const unpause = () => state.set(pause(() => gameLoop(state), state.now))

  const restart = () => {
    state.set(state.history[0])
    unpause()
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
        )
      ]
    )
    : ''
}

export default pauseMenu