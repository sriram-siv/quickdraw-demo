import { $Node } from './draw.js'
import { ghost } from './logic.js'
import { styles } from './objects.js'

export const board = state => {
  const { cells: prevCells } = state[0]
  const { cells, fallingPiece, newLines } = state[1]

  const well = document.querySelector('.game-well')
  if (!well.children.length) {
    Array.from({ length: 200 }).forEach(() => well.appendChild($Node({
      style: {
        backgroundColor: styles.background
      }
    })))
    return
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
    well.children[i].style.backgroundColor === styles.ghost ? acc.concat(i) : acc
  ), []).forEach(i => well.children[i].style.backgroundColor = styles.background)

  cellsToUpdate.forEach(i => {
    if (cells[i]) {
      // Add new ghost
      const position = i - 10 + ghost(state[1])
      well.children[position].style.backgroundColor = styles.ghost
    }

    if (i > 10) {
      well.children[i - 10].style.backgroundColor = cells[i]
        ? fallingPiece.color : styles.background
    }
  })
}

export const preview = (state, { className, piece }) => {
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
          $Node({ style: { backgroundColor: cell ? next[piece].color : 'lightgray' } })
        ))
      })
    ]
  })
}

export const playerData = state => {

  // include deps -> conditionally render
  // would need -- on mount -> create node

  const level = Math.floor(state[1].lines / 10)
  const lines = state[1].lines
  const score = state[1].score

  // deps.some(hasUpdated)
  //  ? element
  //  : querySelector('player-data)

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

export const info = state => {
  // if deps.updated
  // could use draw() like render to return a html element

  const element = document.querySelector('.info')

  const inner = $Node({
    className: 'info',
    children:
      [
        playerData(state),
        preview(state, { className: 'next', piece: 'nextPiece' }),
        preview(state, { className: 'hold', piece: 'holdPiece' })
      ]
  })

  element.replaceWith(inner)
}