import type { AutofitTextPluginOptions } from './index.js';

export interface Nuxt3AppLike {
  vueApp?: {
    use: (plugin: unknown, options?: AutofitTextPluginOptions) => void;
  };
}

export type Nuxt3Plugin = (nuxtApp?: Nuxt3AppLike) => void;

export function createNuxt3Plugin(options?: AutofitTextPluginOptions): Nuxt3Plugin;

declare const plugin: Nuxt3Plugin;
export default plugin;