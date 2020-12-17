





/**
 * Injects app into DOM and calls first draw
 * Returns a state object : { last, now, set }
 * @param {{}} initial state
 * @param {Function} app
 */
export const useState = (initial, app, debug) => {
  const root = document.querySelector('body')
  const state = {
    last: {},
    now: initial,
    history: [{ ...initial }],
    set: (next, append = true) => {
      state.last = { ...state.now }
      state.now = Object.assign(state.now, next)
      if (append) state.history.push({ ...state.now })
      inject(state, app, root) // add true as last arg to get performance data in console
    }
  }
  // Initial draw
  inject(state, app, root)

  if (debug) debugInit(state, debug)

  return state
}

export const inject = (state, app, root, profile) => {
  const t0 = performance.now()
  root.children[0].replaceWith(app(state))
  if (profile) console.log(performance.now() - t0)
}

// TODO turn off
// could call this initalise debug
// and block keypresses through state.debug
export const debugMode = state => {
  // if (!state.debug) return
  const historyLength = state.history.length - 1
  let step = historyLength
  
  window.addEventListener('keydown', ({ key }) => {
    if (key === 'ArrowLeft') {
      state.set(state.history[--step], false)
    }
  })
}

export const debugInit = (state, { keys, callback }) => {
  const activeKeys = {}
  window.addEventListener('keydown', ({ key }) => {
    if (!activeKeys[key]) {
      activeKeys[key] = true
      if (keys.every(val => activeKeys[val])) {
        callback()
        debugMode(state)
      }
    }
  })
  window.addEventListener('keyup', ({ key }) => {
    activeKeys[key] = false
    // if (keys.every(val => !activeKeys[val])) state.set({ debug: false })
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