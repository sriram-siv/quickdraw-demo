import { $Node, hasUpdated } from './draw.js'
import { ghost } from './logic.js'
import { styles } from './objects.js'

export const board = (state, deps) => {
  const element = document.querySelector('.game-well')
  // Update
  if (!hasUpdated(state, deps)) {
    if (element) return element
  }

  const { cells: prevCells } = state[0]
  const { cells, fallingPiece, newLines } = state[1]

  // Initialize
  if (!prevCells) {
    return $Node({
      className: 'game-well',
      children: Array.from({ length: 200 }, () => (
        $Node({ style: { backgroundColor: styles.background } })
      ))
    })
  }

  // Could fix clear lines animation here somehow ??
  if (newLines.length) {
    console.log(newLines.length)
  }

  const cellsToUpdate = cells.reduce((acc, cell, i) => {
    return prevCells[i] !== cell || cell === 1 ? acc.concat(i) : acc
  }, [])

  // Remove previous ghost
  cells.slice(10).reduce((acc, cell, i) => (
    element.children[i].style.backgroundColor === styles.ghost ? acc.concat(i) : acc
  ), []).forEach(i => element.children[i].style.backgroundColor = styles.background)

  cellsToUpdate.forEach(i => {
    if (cells[i]) {
      // Add new ghost
      const position = i - 10 + ghost(state[1])
      if (position < 200) {
        element.children[position].style.backgroundColor = styles.ghost
      } else console.log('missing element at: ', position)
    }

    if (i >= 10) {
      element.children[i - 10].style.backgroundColor = cells[i]
        ? fallingPiece.color : styles.background
    }
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
  // return draw(state, [
  //   { component: playerData },
  //   { component: preview, args: { className: 'next', piece: 'nextPiece' } },
  //   { component: preview, args: { className: 'hold', piece: 'holdPiece' } }
  // ], $Node({ className: 'info' }))
}