import { tetrominoes, offsets, newCell, styles } from './objects.js'

export const rotateArray = (array, direction) => {
  const result = Array.from({ length: array.length }, (_, i) => (
    array.reduce((acc, line) => [line[i], ...acc],[])
  ))
  return direction === 1 ? result : result.map(line => line.reverse()).reverse()
}

// Could refactor this to just be an int and then call styles.blockColors when necessary
export const getBlock = () => {
  const random = Math.floor(Math.random() * tetrominoes.length)
  return {
    block: tetrominoes[random], color: styles.blockColors[random]
  }
}

export const generateController = bindings => {
  const keys = {}
  return {
    get: (key) => keys[key],
    set: (key, timer, delay) => keys[key] = startInterval(timer, delay),
    clear: key => keys[key] = null,
    bindings
  }
}

export const startInterval = (func, interval) => {
  func()
  return setInterval(func, interval)
}

export const lineNumber = (cellIndex) => (
  Math.floor(cellIndex / 10)
)

export const getLine = (line, cells) => (
  cells.slice(line * 10, line * 10 + 10)
)

export const findCompleteLines = prevState => ({
  ...prevState,
  newLines: Array.from({ length: 21 }).reduce((acc, val, i) => (
    getLine(i, prevState.cells).every(cell => cell.value === 2) ? acc.concat(i) : acc
  ), [])
})

export const removeLines = (prevState, lineCount = 0) => {
  const { cells, newLines } = prevState

  return newLines.length > lineCount
    ? removeLines({
      ...prevState,
      cells: cells.map((cell, i) => (
        lineNumber(i) > newLines[lineCount] ? cell : cells[i - 10] || { ...newCell }
      ))
    }, ++lineCount)
    : prevState
}

export const findOffset = (piece, translation, prevState, check = 0) => {
  if (check >= offsets.length) return false
  const spawnMap = getPlacementMap(piece, prevState.fallingPosition + translation + offsets[check])
  const prevSpawn = getPlacementMap(prevState.fallingPiece, prevState.fallingPosition)

  const isFree = spawnMap.every(i => prevState.cells[i]?.value < 2)
  
  const inBounds = Math.abs(translation) === 1
    ? spawnMap.every((val, i) => (val % 10) - (prevSpawn[i] % 10) === translation)
    : spawnMap.every(i => i % 10 !== 0) || spawnMap.every(i => i % 10 !== 9)

  return isFree && inBounds
    ? offsets[check] : findOffset(piece, translation, prevState, ++check)
}

// Change name to map piece?
export const getPlacementMap = (piece, position) => (
  piece.block.map((line, i) => (
    line.map((cell, j) => cell ? position + (i * 10) + j : -1)
  )).flat().filter(val => val > -1)
)

export const ghost = (state, dropDistance = 0) => (
  findOffset(state.fallingPiece, dropDistance + 10, state) === 0
    ? ghost(state, dropDistance + 10)
    : dropDistance
)

export const alterCells = (prevValue, newValue, prevState) => ({
  ...prevState,
  cells: prevState.cells.map(cell => cell.value === prevValue
    ? { value: newValue, color: newValue === 0 ? styles.background : cell.color }
    : cell
  )
})

// Returns the state with the falling piece removed and replaced at the falling position
export const placePiece = prevState => {
  const { fallingPiece, fallingPosition } = prevState
  const spawnMap = getPlacementMap(fallingPiece, fallingPosition)
  
  const cells = alterCells(1, 0, prevState).cells.map((cell, i) => (
    spawnMap.includes(i) ? { value: 1, color: fallingPiece.color } : cell
  ))
  
  return {
    ...prevState,
    cells
  }
}

export const move = (translation, prevState) => {
  const offset = findOffset(prevState.fallingPiece, translation, prevState)
  return offset === false
    ? prevState
    : placePiece({
      ...prevState,
      fallingPosition: prevState.fallingPosition += translation
    })
}

export const rotate = (direction, prevState) => {
  const rotatedPiece = {
    block: rotateArray(prevState.fallingPiece.block, direction),
    color: prevState.fallingPiece.color
  }

  const offset = findOffset(rotatedPiece, 0, prevState)

  return offset === false
    ? prevState
    : placePiece({
      ...prevState,
      fallingPiece: rotatedPiece,
      fallingPosition: prevState.fallingPosition + offset
    })
}

export const spawnBlock = prevState => ({
  ...prevState,
  fallingPosition: 4,
  fallingPiece: prevState.nextPiece,
  nextPiece: getBlock()
})

export const hold = (_, prevState) => {

  const offset = findOffset(prevState.holdPiece || prevState.nextPiece, 0, prevState)

  if (offset === false) return prevState

  return placePiece({
    ...prevState,
    holdPiece: prevState.fallingPiece,
    fallingPiece: prevState.holdPiece || prevState.nextPiece,
    nextPiece: prevState.holdPiece ? prevState.nextPiece : getBlock(),
    fallingPosition: prevState.fallingPosition + offset
  })
}

export const pause = (loopFunction, prevState) => {

  clearInterval(prevState.timer)
  // Minimum 100ms between steps 
  // -100ms for each level increase 
  // -200ms to account for delay for flash animation
  const delay = Math.max(100, 1000 - (Math.floor(prevState.lines / 10) * 100) - 200)

  return {
    ...prevState,
    timer: prevState.timer ? null : setInterval(loopFunction, delay)
  }
}

export const updateScore = prevState => {
  const { newLines, lines, score } = prevState
  const newLineTotal = lines + newLines.length
  const newScore = score + ((Math.floor(lines / 10) + 1) * 40 * [0, 1, 2.5, 7.5, 30][newLines.length])
  return {
    ...prevState,
    lines: newLineTotal,
    score: newScore
  }
}

export const controllerMoveValid = (current, next) => {
  // newStates cells must be rechecked due to asynchronous call
  const placementMap = getPlacementMap(next.fallingPiece, next.fallingPosition)
  const isOutOfBounds = placementMap.some(i => i >= 210)
  const hasCollided = placementMap.some(i => current.cells[i]?.value === 2)
  const hasCloned = current.cells.every(cell => cell?.value !== 1)
    && next.cells.some(cell => cell.value === 1)
  
  return !isOutOfBounds && !hasCollided && !hasCloned
}

export const gameLoop = state => {
  
  if (findOffset(state.now.fallingPiece, 10, state.now) === 0) {
    state.set((move(10, state.now)))
    return
  }

  const self = () => gameLoop(state)
  
  state.set(findCompleteLines(alterCells(1, 2, state.now)))

  setTimeout(() => {
    state.set({
      ...pause(self, pause(self,
        placePiece(spawnBlock(removeLines(updateScore(state.now)))))),
      newLines: []
    })
  }, 200)
}