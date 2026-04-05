# vue-autofit-text

A Vue directive plugin that automatically adjusts font size so text fits its available width.

Compatible with:

- Vue 2
- Vue 3
- TypeScript projects

## Installation

```bash
npm install vue-autofit-text
```

## Quick Start

### Vue 3

#### Global registration (Vue 2)

```javascript
import { createApp } from 'vue';
import AutofitTextPlugin from 'vue-autofit-text';
import App from './App.vue';

const app = createApp(App);
app.use(AutofitTextPlugin);
app.mount('#app');
```

#### Local directive registration (Vue 2)

```javascript
import { autofitText } from 'vue-autofit-text';

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
import AutofitTextPlugin from 'vue-autofit-text';

Vue.use(AutofitTextPlugin);
```

#### Local directive registration

```javascript
import { autofitText } from 'vue-autofit-text';

export default {
  directives: {
    'autofit-text': autofitText,
  },
};
```

### Custom directive name

```javascript
app.use(AutofitTextPlugin, { name: 'my-autofit' });
```

Vue 2:

```javascript
Vue.use(AutofitTextPlugin, { name: 'my-autofit' });
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
import AutofitTextPlugin, { autofitText, type AutofitTextOptions } from 'vue-autofit-text';

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

### Type augmentation for templates (optional)

If you want stricter type checking for directive values in Vue templates, you can add a local declaration file.

```ts
// env.d.ts
import type { AutofitTextOptions } from 'vue-autofit-text';

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
- Vue 2 and Vue 3 compatible
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

## License

MIT
