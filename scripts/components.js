import { draw, hasUpdated, $Node } from './draw.js'
import { ghost, getCellColor } from './functions.js'

export const board = state => {
  const { cells: prevCells } = state[0]
  const { cells } = state[1]

  const well = document.querySelector('.game-well')

  if (!well.children.length) {
    Array.from({ length: 200 }).forEach(() => well.appendChild($Node()))
  }

  Array.from(well.children).forEach((cell, i) => {

    const color = getCellColor(cells, i + 10, ghost(cells))

    const update = !prevCells ||
      color !== getCellColor(prevCells, i + 10, ghost(prevCells))
    
    if (update) {
      cell.style.backgroundColor = color
    }
  })
}

export const preview = (state, { className, piece }) => {
  const next = state[1]
 
  const element = $Node({
    className, children:
    [
      $Node({ type: 'p', className: 'label', children: [className.toUpperCase()] }),
      $Node({
        style: {
          paddingBottom: `${Math.max(1, (4 - next[piece]?.length) * 4.75 / 2)}vh`,
          width: `${next[piece]?.length * 4.75}vh`
        },
        children: next[piece]?.flat().map(cell => (
          $Node({ style: { backgroundColor: cell ? 'lightgreen' : 'lightgray' } })
        ))
      })
    ]
  })
  document.querySelector(`.${className}`).replaceWith(element)
}

export const playerData = state => {

  // include deps -> conditionally render
  // would need -- on mount -> create node

  const level = Math.floor(state[1].lines / 10)
  const lines = state[1].lines
  const score = state[1].score


  const element = $Node({
    className: 'player-data', children:
      [
        $Node({
          className: 'level', children:
            [$Node({ type: 'p', children: [`Level: <span>${level}</span>`] })]
        }),
        $Node({
          className: 'lines', children:
            [$Node({ type: 'p', children: [`Lines: <span>${lines}</span>`] })]
        }),
        $Node({
          className: 'score', children:
            [$Node({ type: 'p', children: [`Score: <span>${score}</span>`] })]
        })
      ]
  })
  document.querySelector('.player-data').replaceWith(element)
}