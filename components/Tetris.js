// import { gameLoop, pause } from '../scripts/logic.js'
import TitleScreen from './TitleScreen.js'
import Game from './Game.js'

// This could be expanded to include a switch or more components
const Tetris = state => (

  state.now.screen === 'title'
    ? TitleScreen(state)
    : Game(state, Object.keys(state.now))
)

export default Tetris