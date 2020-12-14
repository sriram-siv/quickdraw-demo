/**
 * Checks if any dependencies have been updated in the last state change
 * @param {Array} state 
 * @param {Array} dependencies 
 */
export const hasUpdated = ([prev, next], dependencies) => (
  dependencies.some(key => (
    stateValue(prev, key) !== stateValue(next, key)
  ))
)

export const stateValue = (state, keys) => {
  return keys.split('.').reduce((acc, key) => acc[key] ?? acc, state)
}

export const draw = (state, components) => {
  components.forEach(({ component, deps, args }) => {
    if (hasUpdated(state, deps)) component(state, args)
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