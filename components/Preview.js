import { hasUpdated, node } from '../~quickdraw/draw.js'
import { styles } from '../scripts/objects.js'

const Preview = (state, _, { className, piece }) => {
  if (!hasUpdated(state, [piece])) { 
    const element = document.querySelector(piece)
    if (element) return element
  }

  const next = state.now[piece]
 
  return node(
    { className },
    [
      node({ type: 'p', className: 'label' }, className.toUpperCase()),
      node(
        {
          style: {
            paddingBottom: `${Math.max(1, (4 - next?.block.length) * 4.75 / 2)}vh`,
            width: `${next?.block.length * 4.75}vh`
          }
        },
        next?.block.flat().map(cell => (
          node({ className: cell ? 'block bezel' : 'block', style: { backgroundColor: cell ? next?.color : styles.background } })
        ))
      )
    ]
  )
}

export default Preview