import autofitText from './autofitText.js'
import { registerAutofitTextDirective } from './register.js'

const resolveNuxt2Registrar = (context) => {
  const app = context && context.app
  const constructor = app && app.constructor

  if (constructor && typeof constructor.directive === 'function') {
    return constructor
  }

  return null
}

const createNuxt2Plugin = (options = {}) => {
  return (context = {}) => {
    registerAutofitTextDirective(resolveNuxt2Registrar(context), autofitText, options)
  }
}

export { createNuxt2Plugin, resolveNuxt2Registrar }
export default createNuxt2Plugin()