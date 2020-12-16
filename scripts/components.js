import { $Node, hasUpdated } from './draw.js'
import { getLine, ghost } from './logic.js'
import { styles } from './objects.js'

export const board = (state, deps) => {
  const element = document.querySelector('.game-well')
  // Update
  if (!hasUpdated(state, deps)) {
    if (element) return element
  }

  const { cells: prevCells, newLines: prevNewLines } = state[0]
  const { cells, newLines } = state[1]

  // Initialize
  if (!prevCells) {
    return $Node({
      className: 'game-well',
      children: Array.from({ length: 200 }, () => (
        $Node({ style: { backgroundColor: styles.background } })
      ))
    })
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

  const cellsToUpdate = cells.reduce((acc, cell, i) => {
    const update = element.children[i - 10]?.style.backgroundColor !== cell.color
    return update || cell.value === 1 ? acc.concat(i) : acc
  }, [])

  // Update cells
  cellsToUpdate
    .filter(i => i >= 10)
    .forEach(i => {
      element.children[i - 10].style.backgroundColor = cells[i].color
    })

  // Add new ghost
  cellsToUpdate
    .filter(i => cells[i].value === 1)
    .map(i => i + ghost(state[1]))
    .filter(i => cells[i].value !== 1)
    .forEach(i => {
      if (i - 10 < 200) {
        element.children[i - 10].style.backgroundColor = styles.ghost
      } else console.log('youve gone too far!')
      // This is because the ghost is one too low on clearing
    })

  return element
}

export const preview = (state, { className, piece }) => {
  if (!hasUpdated(state, [piece])) { 
    const element = document.querySelector(piece)
    if (element) return element
  }

  const next = state[1]
 
  return $Node({
    className, children:
    [
      $Node({ type: 'p', className: 'label', children: [className.toUpperCase()] }),
      $Node({
        style: {
          paddingBottom: `${Math.max(1, (4 - next[piece]?.block.length) * 4.75 / 2)}vh`,
          width: `${next[piece]?.block.length * 4.75}vh`
        },
        children: next[piece]?.block.flat().map(cell => (
          $Node({ style: { backgroundColor: cell ? next[piece].color : styles.background } })
        ))
      })
    ]
  })
}

export const playerData = state => {
  if (!hasUpdated(state, ['level', 'lines', 'score'])) {
    const element = document.querySelector('.player-data')
    if (element) return element
  }

  const { lines, score } = state[1]
  const level = Math.floor(lines / 10)

  return $Node({
    className: 'player-data', children:
      [
        $Node({
          className: 'level',
          children:
            [$Node({ type: 'p', children: [`Level: <span>${level}</span>`] })]
        }),
        $Node({
          className: 'lines',
          children:
            [$Node({ type: 'p', children: [`Lines: <span>${lines}</span>`] })]
        }),
        $Node({
          className: 'score',
          children:
            [$Node({ type: 'p', children: [`Score: <span>${score}</span>`] })]
        })
      ]
  })
}

export const info = (state, deps) => {
  if (!hasUpdated(state, deps)) {
    const element = document.querySelector('.info')
    if (element) return element
  }

  return $Node({
    className: 'info',
    children:
    [
      playerData(state),
      preview(state, { className: 'next', piece: 'nextPiece' }),
      preview(state, { className: 'hold', piece: 'holdPiece' })
    ]
  })
}

export const pauseMenu = (state, deps) => {
  if (!hasUpdated(state, deps)) {
    const element = document.querySelector('.pause-menu')
    if (element) return element
  }

  return state[1].timer === null
    ? $Node({
      className: 'pause-menu',
      children:
        [
          $Node({ type: 'p', className: 'pause-title', children: ['PAUSED'] }),
          $Node({ type: 'button', children: ['resume'], events: [['click', () => console.log('clicked :)')]] })
        ]
    })
    : ''
}

export const game = state => {
  if (!hasUpdated(state, Object.keys(state[1]))) {
    const element = document.querySelector('.game')
    if (element) return element
  }

  return $Node({
    className: 'game',
    children:
    [
      board(state, ['cells', 'newLines']),
      info(state, ['lines', 'score', 'nextPiece', 'holdPiece']),
      pauseMenu(state, ['timer'])
    ]
  })
}