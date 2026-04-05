import test from 'node:test'
import assert from 'node:assert/strict'

import { autoFit } from '../src/autofitText.js'

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
