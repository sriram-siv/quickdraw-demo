import { node, hasUpdated } from '../~quickdraw/draw.js'

export const Block = (state, deps, index, element) => {
  // Static
  if (!hasUpdated(state, deps)) return element
  // Update
  const cell = state.now.cells[index]

  // const lineNumber = Math.floor(index / 10)
  
  return node(
    {
      className: `block ${cell.value ? 'bezel' : ''}`,
      style: {
        backgroundColor: cell.color
        // Animation needs fixing
        // animation: state.now.newLines.includes(lineNumber) ? 'flash 0.2s' : ''
      }
    }
  )
}

const Board = (state, deps) => {
  const className = 'board'
  const element = document.querySelector(`.${className}`)
  if (!hasUpdated(state, deps)) return element


  const blocks = state.now.cells
    .slice(10)
    .map((cell, i) => (
      // Block(state, [`cells.${i + 10}`, 'newLines'], i + 10, element?.children[i])
      Block(state, [`cells.${i + 10}`], i + 10, element?.children[i])
    ))

  return node(
    { className },
    blocks
  )
}

export default Board