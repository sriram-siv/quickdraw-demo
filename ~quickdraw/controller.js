import { startInterval } from '../scripts/logic.js'

export const initController = (state, controls) => {
  window.addEventListener('keydown', ({ key }) => {
    if (state.debug.active) return
    // Only allow unpause in paused state
    // This isnt very reusable - could allow for control scheme switching
    if (key !== 'Escape' && !state.now.timer) return

    if (!state.controller[key] && controls[key]) {
      const [value, delay, action] = controls[key]
      
      state.controller[key] = startInterval(() => {
        state.set(action(value, state.now))
      }, delay)
    }
  })
  window.addEventListener('keyup', ({ key }) => {
    clearInterval(state.controller[key])
    state.controller[key] = null
  })
}

export const initKeyRegister = ({ keyRegister }) => {
  window.addEventListener('keydown', ({ key, location }) => {
    if (keyRegister[key] === undefined) {
      keyRegister[key] = 0
    }
    if (!location) keyRegister[key] = 1
    else {
      keyRegister[key]++
    }
  })
  window.addEventListener('keyup', ({ key }) => {
    keyRegister[key] = Math.max(0, keyRegister[key] - 1)
  })
}