const defaults = {
  min: 6,
  max: 12,
  target: null,
  container: 'parent',
  step: 1,
  singleLine: true,
}

const toNumber = (value, fallback) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

const normalizeOptions = (options = {}) => {
  const min = toNumber(options.min, defaults.min)
  const max = toNumber(options.max, defaults.max)
  const step = Math.max(1, toNumber(options.step, defaults.step))

  return {
    ...defaults,
    ...options,
    min: Math.min(min, max),
    max: Math.max(min, max),
    step,
  }
}

const resolveTarget = (el, options) => {
  if (typeof options.target === 'string' && options.target.trim()) {
    return el.querySelector(options.target) || el
  }
  return el
}

const resolveContainer = (el, options) => {
  if (options.container === 'self') return el
  if (typeof options.container === 'string' && options.container.trim()) {
    return el.closest(options.container) || el.parentElement || el
  }
  return el.parentElement || el
}

const autoFit = (el, options = {}) => {
  const cfg = normalizeOptions(options)
  const target = resolveTarget(el, cfg)
  const container = resolveContainer(el, cfg)
  const availableWidth = container.clientWidth

  if (!target || !availableWidth) return

  // Ensure measurable width for inline targets like <a>.
  target.style.display = 'inline-block'
  target.style.maxWidth = '100%'
  if (cfg.singleLine) {
    target.style.whiteSpace = 'nowrap'
  }

  let fontSize = cfg.max
  target.style.fontSize = `${fontSize}px`

  while (target.scrollWidth > availableWidth && fontSize > cfg.min) {
    fontSize -= cfg.step
    target.style.fontSize = `${Math.max(fontSize, cfg.min)}px`
  }
}

const stateMap = new WeakMap()

const createState = (el, bindingValue) => {
  const state = {
    options: bindingValue,
    rafId: null,
    resizeObserver: null,
    mutationObserver: null,
    schedule: null,
    onWindowResize: null,
  }

  const run = () => {
    state.rafId = null
    autoFit(el, state.options)
  }

  const raf = typeof requestAnimationFrame === 'function'
    ? requestAnimationFrame
    : (cb) => setTimeout(cb, 16)

  const caf = typeof cancelAnimationFrame === 'function'
    ? cancelAnimationFrame
    : clearTimeout

  const schedule = () => {
    if (state.rafId !== null) caf(state.rafId)
    state.rafId = raf(run)
  }

  state.schedule = schedule

  // Initial run after first layout.
  schedule()

  // Observe parent/container width changes when supported.
  if (typeof ResizeObserver !== 'undefined') {
    const resizeObserver = new ResizeObserver(schedule)
    resizeObserver.observe(el)
    if (el.parentElement) {
      resizeObserver.observe(el.parentElement)
    }
    state.resizeObserver = resizeObserver
  } else {
    const onWindowResize = () => schedule()
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', onWindowResize)
      state.onWindowResize = onWindowResize
    }
  }

  // Observe text/content changes inside the bound element.
  if (typeof MutationObserver !== 'undefined') {
    const mutationObserver = new MutationObserver(schedule)
    mutationObserver.observe(el, {
      characterData: true,
      childList: true,
      subtree: true,
    })
    state.mutationObserver = mutationObserver
  }
  return state
}

const updateState = (el, bindingValue) => {
  const state = stateMap.get(el)
  if (state) {
    state.options = bindingValue
    state.schedule()
    return
  }

  const newState = createState(el, bindingValue)
  stateMap.set(el, newState)
}

const destroyState = (el) => {
  const state = stateMap.get(el)
  if (!state) return

  if (state.resizeObserver) state.resizeObserver.disconnect()
  if (state.mutationObserver) state.mutationObserver.disconnect()

  const rafId = state.rafId
  if (rafId !== null) {
    if (typeof cancelAnimationFrame === 'function') {
      cancelAnimationFrame(rafId)
    } else {
      clearTimeout(rafId)
    }
  }

  if (state.onWindowResize) {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', state.onWindowResize)
    }
  }

  stateMap.delete(el)
}

const autofitTextDirective = {
  // Vue 3
  mounted(el, binding) {
    const state = createState(el, binding && binding.value)
    stateMap.set(el, state)
  },

  updated(el, binding) {
    updateState(el, binding && binding.value)
  },

  unmounted(el) {
    destroyState(el)
  },

  // Vue 2
  inserted(el, binding) {
    const state = createState(el, binding && binding.value)
    stateMap.set(el, state)
  },

  componentUpdated(el, binding) {
    updateState(el, binding && binding.value)
  },

  unbind(el) {
    destroyState(el)
  },
}

export { autoFit }
export default autofitTextDirective
