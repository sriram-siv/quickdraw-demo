export const tetrominoes = [
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

// This can be expanded in scope
export const offsets = [0, 1, -1, -10]

export const styles = {
  background: 'white',
  ghost: 'lightgray'
}