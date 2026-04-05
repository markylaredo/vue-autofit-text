import test from 'node:test'
import assert from 'node:assert/strict'

import { autoFit } from '../src/autofitText.js'
import AutofitTextPlugin, {
  autofitText,
  createAutofitTextInstaller,
  registerAutofitTextDirective,
} from '../src/index.js'
import { createNuxt2Plugin, resolveNuxt2Registrar } from '../src/nuxt2.js'
import { createNuxt3Plugin } from '../src/nuxt3.js'

const parsePx = (value) => Number(String(value || '').replace('px', ''))

const createTarget = ({ multiplier = 10 } = {}) => {
  const target = {
    style: {},
    textContent: 'autofit text',
  }

  Object.defineProperty(target, 'scrollWidth', {
    get() {
      const size = parsePx(target.style.fontSize)
      return size * multiplier
    },
  })

  return target
}

const createElement = ({ parentWidth = 100, target, closestMap = {} } = {}) => {
  const parent = { clientWidth: parentWidth }

  return {
    style: {},
    parentElement: parent,
    querySelector(selector) {
      return selector === '.fit-target' ? target : null
    },
    closest(selector) {
      return closestMap[selector] || null
    },
  }
}

test('shrinks text down to fit the container width', () => {
  const target = createTarget({ multiplier: 10 })
  const el = createElement({ parentWidth: 80, target })

  autoFit(el, { min: 8, max: 20, step: 2, target: '.fit-target' })

  assert.equal(target.style.fontSize, '8px')
  assert.equal(target.style.whiteSpace, 'nowrap')
  assert.equal(target.style.display, 'inline-block')
  assert.equal(target.style.maxWidth, '100%')
})

test('does not force nowrap when singleLine is false', () => {
  const target = createTarget({ multiplier: 5 })
  const el = createElement({ parentWidth: 120, target })

  autoFit(el, { min: 10, max: 24, singleLine: false, target: '.fit-target' })

  assert.equal(target.style.fontSize, '24px')
  assert.equal(target.style.whiteSpace, undefined)
})

test('uses target and container selectors when provided', () => {
  const target = createTarget({ multiplier: 8 })
  const container = { clientWidth: 72 }
  const el = createElement({
    parentWidth: 500,
    target,
    closestMap: { '.fit-container': container },
  })

  autoFit(el, {
    min: 6,
    max: 18,
    step: 1,
    target: '.fit-target',
    container: '.fit-container',
  })

  assert.equal(target.style.fontSize, '9px')
})

test('normalizes invalid option ranges and step values', () => {
  const target = createTarget({ multiplier: 3 })
  const el = createElement({ parentWidth: 120, target })

  autoFit(el, { min: 30, max: 10, step: 0, target: '.fit-target' })

  // min/max are swapped internally, step is clamped to at least 1.
  assert.equal(target.style.fontSize, '30px')
})

test('registerAutofitTextDirective registers the default directive name', () => {
  const calls = []
  const registrar = {
    directive(name, directive) {
      calls.push({ name, directive })
    },
  }

  const registered = registerAutofitTextDirective(registrar, autofitText)

  assert.equal(registered, true)
  assert.deepEqual(calls, [{ name: 'autofit-text', directive: autofitText }])
})

test('createAutofitTextInstaller applies custom directive names', () => {
  const calls = []
  const installer = createAutofitTextInstaller(autofitText)
  const registrar = {
    directive(name, directive) {
      calls.push({ name, directive })
    },
  }

  const registered = installer(registrar, { name: 'fit-text' })

  assert.equal(registered, true)
  assert.deepEqual(calls, [{ name: 'fit-text', directive: autofitText }])
})

test('plugin install uses the shared installer', () => {
  const calls = []
  const registrar = {
    directive(name, directive) {
      calls.push({ name, directive })
    },
  }

  AutofitTextPlugin.install(registrar, { name: 'hero-fit' })

  assert.deepEqual(calls, [{ name: 'hero-fit', directive: autofitText }])
})

test('resolveNuxt2Registrar uses the root Vue constructor from app context', () => {
  const registrar = {
    directive() {},
  }

  assert.equal(resolveNuxt2Registrar({ app: { constructor: registrar } }), registrar)
  assert.equal(resolveNuxt2Registrar({}), null)
})

test('Nuxt 2 plugin registers the directive through app constructor', () => {
  const calls = []
  const plugin = createNuxt2Plugin({ name: 'nuxt-fit' })
  const registrar = {
    directive(name, directive) {
      calls.push({ name, directive })
    },
  }

  plugin({ app: { constructor: registrar } })

  assert.deepEqual(calls, [{ name: 'nuxt-fit', directive: autofitText }])
})

test('Nuxt 3 plugin installs the Vue plugin on vueApp', () => {
  const calls = []
  const plugin = createNuxt3Plugin({ name: 'nuxt-fit' })
  const nuxtApp = {
    vueApp: {
      use(pluginDefinition, options) {
        calls.push({ pluginDefinition, options })
      },
    },
  }

  plugin(nuxtApp)

  assert.deepEqual(calls, [
    {
      pluginDefinition: AutofitTextPlugin,
      options: { name: 'nuxt-fit' },
    },
  ])
})
