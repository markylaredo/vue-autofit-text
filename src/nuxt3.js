import AutofitTextPlugin from './index.js'

const createNuxt3Plugin = (options = {}) => {
  return (nuxtApp) => {
    if (!nuxtApp || !nuxtApp.vueApp || typeof nuxtApp.vueApp.use !== 'function') {
      return
    }

    nuxtApp.vueApp.use(AutofitTextPlugin, options)
  }
}

export { createNuxt3Plugin }
export default createNuxt3Plugin()