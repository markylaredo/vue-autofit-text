# vue-autofit-text

A Vue directive plugin that automatically adjusts font size so text fits its available width.

Compatible with:

- Vue 2
- Vue 3
- Nuxt 2
- Nuxt 3
- TypeScript projects

## Installation

```bash
npm install @markylaredo/vue-autofit-text
```

This package has a `vue` peer dependency, so your app should already have Vue installed.

## Quick Start

### What This Package Exports

From `@markylaredo/vue-autofit-text`:

- default export: Vue plugin for global directive registration
- `autofitText`: directive object for local registration
- `autoFit`: low-level helper you can call manually

From `@markylaredo/vue-autofit-text/nuxt2`:

- default export: Nuxt 2 plugin
- `createNuxt2Plugin`: build a Nuxt 2 plugin with custom options

From `@markylaredo/vue-autofit-text/nuxt3`:

- default export: Nuxt 3 plugin
- `createNuxt3Plugin`: build a Nuxt 3 plugin with custom options

### Vue 3

#### Global registration

```javascript
import { createApp } from 'vue';
import AutofitTextPlugin from '@markylaredo/vue-autofit-text';
import App from './App.vue';

const app = createApp(App);
app.use(AutofitTextPlugin);
app.mount('#app');
```

#### Local directive registration

```javascript
import { autofitText } from '@markylaredo/vue-autofit-text';

export default {
  directives: {
    'autofit-text': autofitText,
  },
};
```

### Vue 2

#### Global registration

```javascript
import Vue from 'vue';
import AutofitTextPlugin from '@markylaredo/vue-autofit-text';

Vue.use(AutofitTextPlugin);
```

#### Local directive registration

```javascript
import { autofitText } from '@markylaredo/vue-autofit-text';

export default {
  directives: {
    'autofit-text': autofitText,
  },
};
```

### Nuxt 3

Preferred approach: create a local Nuxt plugin file and register that.

`plugins/autofit-text.ts`

```ts
import { createNuxt3Plugin } from '@markylaredo/vue-autofit-text/nuxt3'

export default createNuxt3Plugin()
```

`nuxt.config.ts`

```ts
export default defineNuxtConfig({
  plugins: ['~/plugins/autofit-text.ts'],
})
```

Use a custom directive name like this:

```ts
// plugins/autofit-text.ts
import { createNuxt3Plugin } from '@markylaredo/vue-autofit-text/nuxt3'

export default createNuxt3Plugin({ name: 'fit-text' })
```

You can also register the packaged plugin path directly:

```ts
export default defineNuxtConfig({
  plugins: ['@markylaredo/vue-autofit-text/nuxt3'],
})
```

### Nuxt 2

Preferred approach: create a local Nuxt plugin file and register that.

`plugins/autofit-text.js`

```js
import { createNuxt2Plugin } from '@markylaredo/vue-autofit-text/nuxt2'

export default createNuxt2Plugin()
```

`nuxt.config.js`

```js
module.exports = {
  plugins: ['~/plugins/autofit-text.js'],
}
```

Use a custom directive name like this:

```js
// plugins/autofit-text.js
import { createNuxt2Plugin } from '@markylaredo/vue-autofit-text/nuxt2'

export default createNuxt2Plugin({ name: 'fit-text' })
```

You can also register the packaged plugin path directly:

```js
module.exports = {
  plugins: ['@markylaredo/vue-autofit-text/nuxt2'],
}
```

If Nuxt still holds on to an older generated plugin reference after changing setup, clear the build cache and restart:

```bash
rm -rf .nuxt node_modules/.cache
```

### Custom directive name

```javascript
app.use(AutofitTextPlugin, { name: 'my-autofit' });
```

Vue 2:

```javascript
Vue.use(AutofitTextPlugin, { name: 'my-autofit' });
```

Nuxt 2 or Nuxt 3 local plugin:

```javascript
export default createNuxt2Plugin({ name: 'my-autofit' })
```

### Template usage

#### Basic

```vue
<template>
  <div style="width: 200px; height: 50px;" v-autofit-text>
    This text will automatically resize to fit the container
  </div>
</template>
```

#### With Options

```vue
<template>
  <div 
    style="width: 300px; height: 60px;" 
    v-autofit-text="{ min: 12, max: 48, step: 2 }"
  >
    Customizable font size range
  </div>
</template>
```

#### Target a Child Element

```vue
<template>
  <div class="card-title" v-autofit-text="{ target: '.text', max: 32 }">
    <span class="text">Resize only this child node</span>
  </div>
</template>
```

#### Use the Element Itself as Container

```vue
<template>
  <div v-autofit-text="{ container: 'self', min: 14, max: 40 }">
    Fit against this element's own width
  </div>
</template>
```

## Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `min` | `number` | `6` | Minimum font size in pixels |
| `max` | `number` | `12` | Maximum font size in pixels |
| `step` | `number` | `1` | Decrement step while shrinking |
| `target` | `string \| null` | `null` | CSS selector for a child element to resize |
| `container` | `'parent' \| 'self' \| string` | `'parent'` | Width source: parent, self, or closest matching ancestor |
| `singleLine` | `boolean` | `true` | Applies `white-space: nowrap` |

## TypeScript

This package ships with declaration files.

```ts
import AutofitTextPlugin, { autofitText, type AutofitTextOptions } from '@markylaredo/vue-autofit-text';

const options: AutofitTextOptions = {
  min: 10,
  max: 32,
  step: 1,
};

// Use as plugin
app.use(AutofitTextPlugin);

// Or register directive directly
app.directive('autofit-text', autofitText);
```

### Manual Helper Usage

If you want to trigger sizing yourself outside directive hooks, use `autoFit`:

```ts
import { autoFit } from '@markylaredo/vue-autofit-text'

const element = document.querySelector('.headline') as HTMLElement | null

if (element) {
  autoFit(element, { min: 12, max: 40, container: 'self' })
}
```

### Type augmentation for templates (optional)

If you want stricter type checking for directive values in Vue templates, you can add a local declaration file.

```ts
// env.d.ts
import type { AutofitTextOptions } from '@markylaredo/vue-autofit-text';

declare module 'vue' {
  interface ComponentCustomProperties {
    // example property typing if needed in your app
    $autofitDefaults?: AutofitTextOptions;
  }
}
```

## Features

- Responsive: recalculates on content and layout changes
- Configurable: min, max, step, target, container, and line mode
- Lightweight: zero runtime dependencies
- Vue 2, Vue 3, Nuxt 2, and Nuxt 3 compatible
- TypeScript declarations included

## How It Works

The directive starts at `max`, then reduces size by `step` until the text fits the available width (or reaches `min`). It observes layout and content changes with `ResizeObserver` and `MutationObserver`, and falls back to window resize events when `ResizeObserver` is unavailable.

## Full Example

```vue
<template>
  <div class="container">
    <h1 v-autofit-text="{ min: 16, max: 72 }">
      Responsive Heading
    </h1>
    
    <p v-autofit-text="{ min: 10, max: 24 }">
      This paragraph will adjust its font size to fit the container
    </p>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  max-width: 800px;
  height: 400px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
```

## Notes

- The default `max` is `12`. For headings or large labels, set a larger `max` explicitly.
- The directive resizes width-first. If your layout is height-constrained, tune container styles accordingly.
- In Nuxt projects, prefer a local plugin file in `plugins/` when you want the most predictable integration.

## License

MIT
