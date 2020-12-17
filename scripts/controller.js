export const keyRegister = () => {
  const keys = {}
  
  window.addEventListener('keydown', ({ key, location }) => {
    if (!location) keys[key] = 1
    else {
      if (keys[key] === undefined) {
        keys[key] = 0
      }
      keys[key]++
    }
  })
  window.addEventListener('keyup', ({ key }) => {
    keys[key]--
    if (keys[key] < 0) keys[key] = 0
  })

  return key => keys[key]
}

// controls as arg to useState
// -> initControls()

// initControl = config => {
// window.addEventListener()
// ...
// }