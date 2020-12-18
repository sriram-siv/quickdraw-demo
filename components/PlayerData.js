import { hasUpdated, node } from  '../~quickdraw/draw.js'

const PlayerData = (state, deps) => {
  const className = 'player-data'
  if (!hasUpdated(state, deps)) {
    return document.querySelector(`.${className}`)
  }

  const { lines, score } = state.now
  const level = Math.floor(lines / 10)

  const children = [
    ['Lines', lines.toString()],
    ['Level', level.toString()],
    ['Score', score.toString()]
  ]

  return node(
    { className },
    children.map(([name, value]) => (
      node(
        { className: name.toLowerCase() },
        node(
          { type: 'p' },
          [`${name}: `, node({ type: 'span' }, value)]
        )
      )
    ))
  )
}

export default PlayerData