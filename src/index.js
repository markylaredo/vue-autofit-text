import autofitText from './autofitText.js';

/**
 * Vue Autofit Text Plugin
 * 
 * Usage:
 * 
 * // Global registration
 * import { createApp } from 'vue';
 * import AutofitTextPlugin from 'vue-autofit-text';
 * 
 * const app = createApp(App);
 * app.use(AutofitTextPlugin);
 * 
 * // Or with custom directive name
 * app.use(AutofitTextPlugin, { name: 'my-autofit' });
 * 
 * // In template:
 * <div v-autofit-text>Hello World</div>
 * <div v-autofit-text="{ minFontSize: 10, maxFontSize: 48 }">Responsive Text</div>
 */

const AutofitTextPlugin = {
  install(appOrVue, options = {}) {
    const directiveName = options.name || 'autofit-text';

    if (!appOrVue || typeof appOrVue.directive !== 'function') {
      return;
    }

    appOrVue.directive(directiveName, autofitText);
  }
};

export { autofitText };
export default AutofitTextPlugin;
