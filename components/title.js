import { node } from '../~quickdraw/draw.js'
import { gameLoop } from '../scripts/logic.js'

const title = state => {


  const startGame = () => state.set({
    screen: 'game',
    timer: setInterval(() => gameLoop(state), 1000)
  })

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

export default title