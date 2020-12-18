export const initDebug = (state, opts) => {
  if (!opts?.use) return

  const activationKeys = ['Control', '/']
  const printState = '/'

  window.addEventListener('keydown', ({ key }) => {
    if (activationKeys.every(val => state.keyRegister[val])) {
      state.debug.active = !state.debug.active
      state.debug.move(state.history.length - 1)
      state.set(opts.callback())
      if (state.debug.active) console.log(state.history)
    }
    if (state.debug.active) {
      if (key === printState) console.log(`state[${state.debug.step}]:`, state.now)
      const stepValues = {
        ArrowLeft: state.debug.step - 1,
        ArrowRight: state.debug.step + 1,
        ArrowUp: state.history.length - 1,
        ArrowDown: 0
      }
      if (stepValues[key] === undefined) return
      const position = Math.max(0, Math.min(stepValues[key], state.history.length - 1))
      state.debug.move(position)
    }
  })
}