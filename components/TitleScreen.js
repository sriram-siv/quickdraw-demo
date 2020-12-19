import { node } from '../~quickdraw/draw.js'
import { gameLoop, move } from '../scripts/logic.js'
import { newCell } from '../scripts/objects.js'

const TitleScreen = state => {

  const startGame = () => {
    state.set({
      cells: Array.from({ length: 210 }, () => ({ ...newCell })),
      screen: 'game',
      timer: setInterval(() => gameLoop(state), 1000)
    })
    state.set(move(0, state.now))
  }

  return node(
    {
      className: 'title-screen'
    },
    [
      'TETRIS',
      node(
        {
          type: 'button',
          events: [['click', startGame]]
        },
        'start game'
      )
    ]
  )
}

export default TitleScreen