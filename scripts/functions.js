export const rotateArray = (array, direction) => {
  const result = Array.from({ length: array.length }, (_, i) => (
    array.reduce((acc, line) => [line[i], ...acc],[])
  ))
  return direction === 1 ? result : result.map(line => line.reverse()).reverse()
}

export const getRandomBlock = () => {
  const tetrominoes = [
    [
      [1, 1],
      [1, 1]
    ],
    [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0]
    ],
    [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0]
    ],
    [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0]
    ],
    [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]
  ]
  return tetrominoes[Math.floor(Math.random() * tetrominoes.length)]
}

export const generateController = () => {
  const keys = {}
  return {
    getKey: (key) => keys[key],
    setKey: (key, timer) => keys[key] = timer
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
    getLine(i, prevState.cells).every(cell => cell === 2) ? acc.concat(i) : acc
  ), [])
})

export const removeLines = prevState => {
  const { cells, newLines } = prevState
  return newLines.length
    ? removeLines({
      ...prevState,
      cells: cells.map((cell, i) => (
        lineNumber(i) > newLines[0] ? cell : cells[i - 10] || 0
      )),
      newLines: newLines.slice(1)
    })
    : prevState
}

export const checkMoveIsValid = (direction, cells) => {
  const boundaries = { '-1': 0, '1': 9 }

  const activeCells = cells.reduce((acc, cell, i) => (
    cell === 1 ? acc.concat(i) : acc
  ), [])
  
  if (!activeCells.length || activeCells.some(i => i % 10 === boundaries[direction])) return false

  return activeCells.every(i => cells[i + direction] < 2)
}

export const checkRotationIsValid = (rotatedPiece, prevState, check = 0) => {
  // This can be expanded in scope
  const offsets = [0, 1, -1, -10]
  if (check >= offsets.length) return false
  
  const spawnMap = getPlacementMap(rotatedPiece, prevState.fallingPosition + offsets[check])
  const isFree = spawnMap.every(i => prevState.cells[i] < 2)
  const inBounds = spawnMap.every(i => i % 10 !== 0) || spawnMap.every(i => i % 10 !== 9)

  return isFree && inBounds ? offsets[check] : checkRotationIsValid(rotatedPiece, prevState, ++check)
}

export const getPlacementMap = (piece, position) => (
  piece.map((line, i) => (
    line.map((cell, j) => cell ? position + (i * 10) + j : 0)
  )).flat().filter(val => val)
)

export const getCellColor = (cells, index, ghostDistance) => {
  if (cells[index]) return 'black'
  if (cells[index - ghostDistance] === 1) return 'grey'
  else return 'white'
}

export const ghost = (cells, dropDistance = 0) => (
  checkMoveIsValid(dropDistance + 10, cells)
    ? ghost(cells, dropDistance + 10)
    : dropDistance
)

export const flashLines = ({ newLines }, displayCells) => {
  newLines.forEach(line => {
    const cells = getLine(--line, displayCells)
    cells.forEach(cell => cell.style.animation = 'flash 0.3s forwards')
  })
  return delayedFunction => setTimeout(() => {
    delayedFunction()
    displayCells.forEach(cell => cell.style.animation = '')
  }, 300)
}

export const alterCells = (prevValue, newValue, prevState) => ({
  ...prevState,
  cells: prevState.cells.map(cell => cell === prevValue ? newValue : cell)
})

// Returns the state with the falling piece removed and replaced at the falling position
export const placePiece = prevState => {
  const { fallingPiece, fallingPosition } = prevState
  const spawnMap = getPlacementMap(fallingPiece, fallingPosition)
  const cells = alterCells(1, 0, prevState).cells.map((cell, i) => spawnMap.includes(i) ? 1 : cell)
  
  return {
    ...prevState,
    cells
  }
}

export const move = (translation, prevState) => {
  return checkMoveIsValid(translation, prevState.cells)
    ? placePiece({
      ...prevState,
      fallingPosition: prevState.fallingPosition += translation
    })
    : prevState
}

export const rotate = (direction, prevState) => {
  const rotatedPiece = rotateArray(prevState.fallingPiece, direction)
  const offset = checkRotationIsValid(rotatedPiece, prevState)

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
  nextPiece: getRandomBlock()
})

export const hold = (_, prevState) => (
  placePiece({
    ...prevState,
    holdPiece: prevState.fallingPiece,
    fallingPiece: prevState.holdPiece ?? prevState.nextPiece,
    nextPiece: prevState.holdPiece ? prevState.nextPiece : getRandomBlock()
  })
)

export const pause = (loopFunction, prevState) => {
  const level = Math.floor(prevState.lines / 10) * 10
  clearInterval(prevState.timer)
  return {
    ...prevState,
    timer: prevState.timer ? null : setInterval(loopFunction, 1000 - (level * 10))
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