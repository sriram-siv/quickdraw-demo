/**
 * Injects app into DOM and calls first draw
 * Returns a state object : { last, now, set }
 * @param {{}} initial state
 * @param {Function} app
 */
export const useState = (initial = {}, app, debugOpts = {}) => {
  if (!app) return
  const root = document.querySelector('body')
  const state = {
    last: {},
    now: initial,
    set: next => {
      state.last = { ...state.now }
      state.now = Object.assign(state.now, next)
      state.debug.history.push({ ...state.now })
      inject(state, app, root) // add true as last arg to get performance data in console
    },
    debug: {
      active: false,
      history: [{ ... initial }],
      step: null,
      move: position => {
        state.last = { ...state.now }
        state.now = { ...state.debug.history[position] }
        state.debug.step = position
        inject(state, app, root)
      }
    }
  }
  debugInit(state, debugOpts)

  // Initial draw
  inject(state, app, root)

  return state
}

export const inject = (state, app, root, profile) => {
  const t0 = performance.now()
  root.children[0].replaceWith(app(state))
  if (profile) console.log(performance.now() - t0)
}

export const debugInit = (state, { keys, callback }) => {
  if (!keys) return
  const activeKeys = {}
  window.addEventListener('keydown', ({ key }) => {
    if (!activeKeys[key]) {
      activeKeys[key] = true
      if (keys.every(val => activeKeys[val])) {
        state.debug.active = !state.debug.active
        if (state.debug.active) console.log(state.debug.history)
        state.debug.move(state.debug.history.length - 1)
        callback()
      }
    }
  })
  window.addEventListener('keyup', ({ key }) => {
    activeKeys[key] = false
  })
  window.addEventListener('keydown', ({ key }) => {
    if (!state.debug.active) return
    if (key === '/') console.log(`state[${state.debug.step}]:`, state.now)
    const stepValues = {
      ArrowLeft: state.debug.step - 1,
      ArrowRight: state.debug.step + 1,
      ArrowUp: state.debug.history.length - 1,
      ArrowDown: 0
    }
    if (stepValues[key] === undefined) return
    const position = Math.max(0, Math.min(stepValues[key], state.debug.history.length - 1))
    state.debug.move(position)
  })
}

export const node = ({ type, className, style, events } = {}, children) => {
  // Could change this to allow for fragments
  const element = document.createElement(type || 'div')
  if (className) {
    className.split(' ').forEach(singleClass => element.classList.add(singleClass))
    // element.classList.add(className)
  }
  if (style) {
    Object.keys(style).forEach(property => element.style[property] = style[property])
  }
  // Allow for single children
  if (children && !Array.isArray(children)) children = [children]
  // Attach Children
  children?.forEach(child => {
    if (typeof(child) === 'string') element.innerHTML += child
    else element.append(child)
  })
  // Attach Events
  events?.forEach(([type, callback]) => element.addEventListener(type, callback))
  return element
}

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