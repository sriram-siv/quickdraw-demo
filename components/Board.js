import { node, hasUpdated } from '../~quickdraw/draw.js'
import { getLine, ghost } from '../scripts/logic.js'
import { styles } from '../scripts/objects.js'

const Board = (state, deps) => {

  // TODO fit this in line with general pattern
  // Cell component -> each updates according to state.cells[i + 10]
  // How to handle ghost ?
  // Des[ i, i - ghost ] ??

  
  
  let element = document.querySelector('.game-well')
  
  if (!hasUpdated(state, deps)) {
    return element
  }
  
  const { cells, newLines } = state.now

  // Initialize
  if (!element) {
    element = node(
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
  state.last.newLines.forEach(lineNumber => {
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

export default Board