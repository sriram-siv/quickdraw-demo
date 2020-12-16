import { node, hasUpdated } from './draw.js'
import { getLine, ghost, pause, gameLoop, getBlock } from './logic.js'
import { styles, newCell } from './objects.js'

export const board = (state, deps) => {

  // TODO fit this in line with general pattern

  const element = document.querySelector('.game-well')
  if (!hasUpdated(state, deps)) {
    return element
  }

  const { cells: prevCells, newLines: prevNewLines } = state.last
  const { cells, newLines } = state.now

  // Initialize
  if (!prevCells) {
    return node({
      className: 'game-well',
      children: Array.from({ length: 200 }, () => (
        node({ style: { backgroundColor: styles.background } })
      ))
    })
  }

  // Flash lines
  newLines.forEach(lineNumber => {
    const line = getLine(lineNumber - 1, Array.from(element.children))
    line.forEach(cell => cell.style.animation = 'flash 0.2s')
  })
  prevNewLines.forEach(lineNumber => {
    const line = getLine(lineNumber - 1, Array.from(element.children))
    line.forEach(cell => cell.style.animation = '')
  })

  const cellsToUpdate = cells.reduce((acc, cell, i) => {
    const update = element.children[i - 10]?.style.backgroundColor !== cell.color
    return update || cell.value === 1 ? acc.concat(i) : acc
  }, [])

  // Update cells
  cellsToUpdate
    .filter(i => i >= 10)
    .forEach(i => {
      element.children[i - 10].style.backgroundColor = cells[i].color
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

export const preview = (state, _, { className, piece }) => {
  if (!hasUpdated(state, [piece])) { 
    const element = document.querySelector(piece)
    if (element) return element
  }

  const next = state.now
 
  return node({
    className, children:
    [
      node({ type: 'p', className: 'label', children: [className.toUpperCase()] }),
      node({
        style: {
          paddingBottom: `${Math.max(1, (4 - next[piece]?.block.length) * 4.75 / 2)}vh`,
          width: `${next[piece]?.block.length * 4.75}vh`
        },
        children: next[piece]?.block.flat().map(cell => (
          node({ style: { backgroundColor: cell ? next[piece].color : styles.background } })
        ))
      })
    ]
  })
}

export const playerData = (state, deps) => {
  const className = 'player-data'
  if (!hasUpdated(state, deps)) {
    return document.querySelector(`.${className}`)
  }

  const { lines, score } = state.now
  const level = Math.floor(lines / 10)

  return node({
    className,
    children:
      [
        // With children as second argument
        // node(
        //   { className: 'level' },
        //   [node(
        //     { type: 'p' },
        //     ['Level:', node({ type: 'span', children: [level] })]
        //   )]
        // ),
        node({
          className: 'level',
          children:
            node({
              type: 'p',
              children: ['Level: ', node({ type: 'span', children: [level] })]
            })
        }),
        node({
          className: 'lines',
          children:
            node({ type: 'p', children: [`Lines: <span>${lines}</span>`] })
        }),
        node({
          className: 'score',
          children:
            node({ type: 'p', children: [`Score: <span>${score}</span>`] })
        })
      ]
  })
}

export const info = (state, deps) => {
  const className = 'info'
  if (!hasUpdated(state, deps)) {
    return document.querySelector(`.${className}`)
  }

  return node({
    className,
    children:
    [
      playerData(state, ['lines', 'score']),
      preview(state, [], { className: 'next', piece: 'nextPiece' }),
      preview(state, [], { className: 'hold', piece: 'holdPiece' })
    ]
  })
}

export const pauseMenu = (state, deps) => {
  const className = 'pause-menu'
  if (!hasUpdated(state, deps)) {
    return document.querySelector(`.${className}`) || ''
  }

  const unpause = () => state.set(pause(() => gameLoop(state), state.now))

  const restart = () => {
    state.set({
      cells: Array.from({ length: 210 }, () => ({ ...newCell })),
      fallingPosition: 4,
      fallingPiece: getBlock(),
      nextPiece: getBlock(),
      holdPiece: null,
      lines: 0,
      score: 0,
      newLines: [],
      timer: 0
    })
    unpause()
  }

  return !state.now.timer
    ? node({
      className,
      children:
        [
          node({ type: 'p', className: 'pause-title', children: ['PAUSED'] }),
          node({
            type: 'button',
            children: ['resume'],
            events: [['click', unpause]]
          }),
          node({
            type: 'button',
            children: ['restart'],
            events: [['click', restart]]
          })
        ]
    })
    : ''
}

export const game = state => {
  if (!hasUpdated(state, Object.keys(state.now))) {
    return document.querySelector('.game')
  }

  return node({
    className: 'game',
    children:
    [
      board(state, ['cells', 'newLines']),
      info(state, ['lines', 'score', 'nextPiece', 'holdPiece']),
      pauseMenu(state, ['timer'])
    ]
  })
}