export const tetrominoesx = [
  {
    block: [
      [1, 1],
      [1, 1]
    ], color: 'lightblue'
  },
  {
    block: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0]
    ], color: 'lightgreen'
  },
  {
    block: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ], color: 'lightpink'
  },
  {
    block: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0]
    ], color: 'lightblue'
  },
  {
    block: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0]
    ], color: 'lightgreen'
  },
  {
    block: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]
    ], color: 'lightpink'
  },
  {
    block: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ], color: 'lightblue'
  }
]

export const tetrominoes = [
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

// This can be expanded in scope
export const offsets = [0, 1, -1, -10]

export const styles = {
  background: 'white',
  ghost: 'lightgray',
  blockColors: [
    'lightblue',
    'lightgreen',
    'lightpink',
    'lightseagreen',
    'lightsalmon',
    'palevioletred',
    'plum'
  ]
}

export const newCell = { value: 0, color: styles.background }