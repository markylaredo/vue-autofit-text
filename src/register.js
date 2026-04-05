const DEFAULT_DIRECTIVE_NAME = 'autofit-text'

const resolveDirectiveName = (options = {}) => options.name || DEFAULT_DIRECTIVE_NAME

const registerAutofitTextDirective = (appOrVue, directive, options = {}) => {
  if (!appOrVue || typeof appOrVue.directive !== 'function') {
    return false
  }

  appOrVue.directive(resolveDirectiveName(options), directive)
  return true
}

const createAutofitTextInstaller = (directive) => {
  return (appOrVue, options = {}) => registerAutofitTextDirective(appOrVue, directive, options)
}

export {
  DEFAULT_DIRECTIVE_NAME,
  createAutofitTextInstaller,
  registerAutofitTextDirective,
  resolveDirectiveName,
}