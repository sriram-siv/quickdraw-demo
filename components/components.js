import { node, hasUpdated } from '../scripts/draw.js'
import { getLine, ghost } from '../scripts/logic.js'
import { styles } from '../scripts/objects.js'

// TODO break this file out into single components

export const board = (state, deps) => {
  
  // TODO fit this in line with general pattern
  
  const element = document.querySelector('.game-well')
  
  if (!hasUpdated(state, deps)) {
    return element
  }
  
  const { newLines: prevNewLines } = state.last
  const { cells, newLines } = state.now

  // Initialize
  if (!element) {
    return node(
      { className: 'game-well' },
      Array.from({ length: 200 }, () => (
        node({ className: 'block', style: { backgroundColor: styles.background } })
      ))
    )
  }

  // Flash lines
  newLines.forEach(lineNumber => {
    const line = getLine(lineNumber - 1, Array.from(element.children))
    line.forEach(cell => cell.style.animation = 'flash 0.2s')
  })
  prevNewLines.forEach(lineNumber => {
    const line = getLine(lineNumber - 1, Array.from(element.children))
    line.forEach(cell => cell.style.animation = '')
  })

  if (newLines.length) return element

  const cellsToUpdate = cells.reduce((acc, cell, i) => {
    // TODO use hasUpdated ? (state, [cells.i]) // will need to test nested key functionality
    // Doenst account for ghost though..
    const update = element.children[i - 10]?.style.backgroundColor !== cell.color
    return update || cell.value === 1 ? acc.concat(i) : acc
  }, [])

  // Update cells
  cellsToUpdate
    .filter(i => i >= 10)
    .forEach(i => {
      element.children[i - 10].style.backgroundColor = cells[i].color
      if (cells[i].value > 0) element.children[i - 10].classList.add('bezel')
      else element.children[i - 10].classList.remove('bezel')
    })

  // Add new ghost
  cellsToUpdate
    .filter(i => cells[i].value === 1)
    .map(i => i + ghost(state.now))
    // Dont draw over active cells
    .filter(i => cells[i].value !== 1)
    .forEach(i => (
      element.children[i - 10].style.backgroundColor = styles.ghost
    ))

  return element
}

export const preview = (state, _, { className, piece }) => {
  if (!hasUpdated(state, [piece])) { 
    const element = document.querySelector(piece)
    if (element) return element
  }

  const next = state.now
 
  return node(
    { className },
    [
      node({ type: 'p', className: 'label' }, className.toUpperCase()),
      node(
        {
          style: {
            paddingBottom: `${Math.max(1, (4 - next[piece]?.block.length) * 4.75 / 2)}vh`,
            width: `${next[piece]?.block.length * 4.75}vh`
          }
        },
        next[piece]?.block.flat().map(cell => (
          node({ className: cell ? 'block bezel' : 'block', style: { backgroundColor: cell ? next[piece].color : styles.background } })
        ))
      )
    ]
  )
}

export const playerData = (state, deps) => {
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

export const info = (state, deps) => {
  const className = 'info'
  if (!hasUpdated(state, deps)) {
    return document.querySelector(`.${className}`)
  }

  return node(
    { className },
    [
      playerData(state, ['screen', 'lines', 'score']),
      preview(state, [], { className: 'next', piece: 'nextPiece' }),
      preview(state, [], { className: 'hold', piece: 'holdPiece' })
    ]
  )
}
