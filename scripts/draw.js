/**
 * Checks if any dependencies have been updated in the last state change
 * @param {Array} state 
 * @param {Array} dependencies 
 */
export const hasUpdated = ([prev, next], dependencies) => (
  dependencies.some(key => {
    const prevValue = stateValue(prev, key)
    const nextValue = stateValue(next, key)
    const prevKeys = Object.keys(prevValue)
    const nextKeys = Object.keys(nextValue)

    return typeof(nextValue) === 'object'
      ? prevKeys.length !== nextKeys.length || hasUpdated([prevValue, nextValue], prevKeys)
      : prevValue !== nextValue
  })
)

// can take a nested key in the form < 'key.subKey' >
export const stateValue = (state, keys) => {
  return keys.split('.').reduce((acc, key) => state[key] ?? acc, [])
}

export const draw = (state, components, root) => {
  components.map(({ component, deps, args }, i) => {
    const child = component(state, deps, args)
    root.children[i].replaceWith(child)
  })
}

export const $Node = ({ type, className, style, children } = {}) => {
  const node = document.createElement(type || 'div')
  if (className) node.classList.add(className)
  if (style) {
    Object.keys(style).forEach(property => node.style[property] = style[property])
  }
  if (children) {
    children.forEach(child => {
      if (typeof(child) === 'string') node.innerHTML += child
      else node.append(child)
    })
  }
  return node
}

export const useState = (initial, children) => {
  const root = document.querySelector('.game')
  const state = [
    {},
    initial
  ]
  draw(state, children, root)
  return [
    state,
    next => {
      state[0] = { ...state[1] }
      state[1] = Object.assign(state[1], next)
      // const t0 = performance.now()
      draw(state, children, root)
      // console.log(performance.now() - t0)
    }
  ]
}