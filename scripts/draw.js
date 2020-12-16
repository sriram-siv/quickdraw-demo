/**
 * Checks if any dependencies have been updated in the last state change
 * @param {Array} state 
 * @param {Array} dependencies 
 */
export const hasUpdated = ({ last, now }, dependencies) => (
  dependencies.some(key => {
    const prevValue = stateValue(last, key)
    const nextValue = stateValue(now, key)
    const nextKeys = Object.keys(nextValue)
    
    return typeof(nextValue) === 'object'
      ? prevValue.length !== nextValue.length || hasUpdated({ last: prevValue, now: nextValue }, nextKeys)
      : prevValue !== nextValue
  })
)

// can take a nested key in the form < 'key.subKey' >
export const stateValue = (state, keys) => {
  return keys.split('.').reduce((acc, key) => state[key] ?? acc, [])
}

export const draw = (state, app, root) => {
  app.map(({ component, deps, args }, i) => {
    const child = component(state, deps, args)
    root.children[i].replaceWith(child)
  })
  // root.children[0].replaceWith(app(state))
}

export const $Node = ({ type, className, style, children, events } = {}) => {
  const node = document.createElement(type || 'div')
  if (className) node.classList.add(className)
  if (style) {
    Object.keys(style).forEach(property => node.style[property] = style[property])
  }
  // Attach Children
  children?.forEach(child => {
    if (typeof(child) === 'string') node.innerHTML += child
    else node.append(child)
  })
  // Attach Events
  events?.forEach(([type, callback]) => node.addEventListener(type, callback))
  return node
}

export const useState = (initial, app) => {
  const root = document.querySelector('body')
  const state = {
    last: {},
    now: initial,
    set: next => {
      state.last = { ...state.now }
      state.now = Object.assign(state.now, next)

      // const t0 = performance.now()
      draw(state, app, root)
      // console.log(performance.now() - t0)
    }
  }
  // Initial draw
  draw(state, app, root)

  return state
}