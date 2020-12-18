// import { gameLoop, pause } from '../scripts/logic.js'
import title from './title.js'
import game from './game.js'

// This could be expanded to include a switch or more components
export const tetris = state => {
  
  return state.now.screen === 'title'
    ? title(state)
    : game(state, Object.keys(state.now))
}