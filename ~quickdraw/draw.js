import { initController, initKeyRegister } from './controller.js'
import { initDebug } from './debug.js'

/**
 * Injects app into DOM and calls first draw
 * Returns a state object : { last, now, set }
 * @param {{}} initial state
 * @param {Function} app
 */
export const initialize = ({ app, initial = {}, controls, historyLength, debugCallback }) => {
  if (!app) return
  const root = document.querySelector('body')
  const state = {
    last: {},
    now: initial,
    set: next => {
      state.last = { ...state.now }
      state.now = Object.assign(state.now, next)
      
      const slicePosition = Math.max(0, state.history.length - (historyLength ?? Infinity) + 1)
      state.history = [...state.history.slice(slicePosition), { ...state.now }]
      
      // inject(state, app, root, true) // Log performance data
      inject(state, app, root)
    },
    history: [{ ... initial }],
    debug: {
      active: false,
      step: null,
      move: position => {
        state.last = { ...state.now }
        state.now = { ...state.history[position] }
        state.debug.step = position
        inject(state, app, root)
      }
    },
    keyRegister: {},
    controller: {}
  }

  initKeyRegister(state)
  initController(state, controls)
  initDebug(state, debugCallback)

  // Initial draw
  inject(state, app, root)

  return state
}

export const inject = (state, app, root, profile) => {
  const t0 = performance.now()
  root.children[0].replaceWith(app(state))
  if (profile) console.log(performance.now() - t0)
}

export const node = ({ type, className, style, events } = {}, children) => {
  // Could change this to allow for fragments
  const element = document.createElement(type || 'div')

  if (className) {
    className
      .split(/\s+/)
      .filter(val => val)
      .forEach(singleClass => element.classList.add(singleClass))
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
  return keys.split('.').reduce((acc, key) => acc[key] ?? [], state)
}