import { node, hasUpdated } from '../~quickdraw/draw.js'
import { ghost } from '../scripts/logic.js'

export const Block = (state, deps) => {

  const index = deps[0].match(/\d+/)[0]
  const ghoster = deps[1].match(/[-]*\d+/)[0]

  const cell = state.now.cells[index]

  // This is where using id's would help - or unique generated classnames
  if (!hasUpdated(state, deps)) {
    const element = document.querySelector(`.game-well > :nth-child(${index - 9})`)
    return element || node({ className: 'block', style: { backgroundColor: 'white' } })
  }

  const className = `block ${cell.value ? 'bezel' : ''}`

  const color = state.now.cells[ghoster]?.value === 1 && cell.value === 0
    ? 'lightgrey'
    : cell.color
  
  const cellEl = node(
    {
      className,
      style: { backgroundColor: color }
    }
  )


  return cellEl
}


const Board = (state, deps) => {
  const className = 'game-well' // Rename to board?
  if (!hasUpdated(state, deps)) {
    return document.querySelector(`.${className}`)
  }

  const ghostDistance = ghost(state.now)

  const blocks = state.now.cells
    .slice(10)
    .map((cell, i) => {
      const res = Block(state, [`cells.${i + 10}`, `cells.${i + 10 - ghostDistance}`])
      return res
    })

  return node(
    { className: 'game-well' },
    blocks
  )
}

export default Board