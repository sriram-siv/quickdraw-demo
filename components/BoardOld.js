import { node, hasUpdated } from '../~quickdraw/draw.js'
import { getLine } from '../scripts/logic.js'
import { styles } from '../scripts/objects.js'

const Board = (state, deps) => {

  const element = document.querySelector('.game-well')
    || node(
      { className: 'game-well' },
      Array.from({ length: 200 }, () => (
        node({ className: 'block', style: { backgroundColor: styles.background } })
      ))
    )
  
  if (!hasUpdated(state, deps)) {
    return element
  }
  
  const { cells, newLines } = state.now

  // Flash lines
  newLines.forEach(lineNumber => {
    const line = getLine(lineNumber - 1, Array.from(element.children))
    line.forEach(cell => cell.style.animation = 'flash 0.2s')
  })
  state.last.newLines.forEach(lineNumber => {
    const line = getLine(lineNumber - 1, Array.from(element.children))
    line.forEach(cell => cell.style.animation = '')
  })

  if (newLines.length) return element

  const cellsToUpdate = cells.reduce((acc, cell, i) => {
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

  return element
}

export default Board