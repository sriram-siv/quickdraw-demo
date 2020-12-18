import { hasUpdated, node } from '../~quickdraw/draw.js'
import Preview from './Preview.js'
import PlayerData from './PlayerData.js'

const Info = (state, deps) => {
  const className = 'info'
  if (!hasUpdated(state, deps)) {
    return document.querySelector(`.${className}`)
  }

  return node(
    { className },
    [
      PlayerData(state, ['screen', 'lines', 'score']),
      Preview(state, [], { className: 'next', piece: 'nextPiece' }),
      Preview(state, [], { className: 'hold', piece: 'holdPiece' })
    ]
  )
}

export default Info