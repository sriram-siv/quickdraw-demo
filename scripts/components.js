import { $Node } from './draw.js'
import { ghost, getCellColor } from './logic.js'

export const board = state => {
  const { cells: prevCells } = state[0]
  const { cells } = state[1]


  const well = document.querySelector('.game-well')

  if (!well.children.length) {
    Array.from({ length: 200 }).forEach(() => well.appendChild($Node()))
    return
  }

  Array.from(well.children).forEach((cell, i) => {

    const fill = getCellColor(cells, i + 10, ghost(state[1]))
    const color = fill === 'fill'
      ? state[1].fallingPiece.color : fill

    const update = cells[i + 10] === 1
      || fill !== getCellColor(prevCells, i + 10, ghost(state[0]))
      || cell.style.backgroundColor === 'gray'
      || fill === 'gray'
    
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
          paddingBottom: `${Math.max(1, (4 - next[piece]?.block.length) * 4.75 / 2)}vh`,
          width: `${next[piece]?.block.length * 4.75}vh`
        },
        children: next[piece]?.block.flat().map(cell => (
          $Node({ style: { backgroundColor: cell ? next[piece].color : 'lightgray' } })
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

  // deps.some(hasUpdated)
  //  ? element
  //  : querySelector('player-data)

  const nested = $Node({ style: { backgroundColor: 'red', height: '20px' } })


  const element = $Node({
    className: 'player-data', children:
      [
        nested,
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
  document.querySelector('.player-data').replaceWith(element)
}

export const info = state => {
  // if deps.updated
  // querySelector('.info').replace($Node({ children: [
  //   playerData(state),
  //   preview(next)
  //   preview(hold)
  // ]}))
}