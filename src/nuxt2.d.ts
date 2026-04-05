import type { AutofitTextPluginOptions, VueDirectiveRegistrar } from './index.js';

export interface Nuxt2ContextLike {
  app?: {
    constructor?: VueDirectiveRegistrar;
  };
}

export type Nuxt2Plugin = (context?: Nuxt2ContextLike) => void;

export function resolveNuxt2Registrar(
  context?: Nuxt2ContextLike,
): VueDirectiveRegistrar | null;
export function createNuxt2Plugin(options?: AutofitTextPluginOptions): Nuxt2Plugin;

declare const plugin: Nuxt2Plugin;
export default plugin;