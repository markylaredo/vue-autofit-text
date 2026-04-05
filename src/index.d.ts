export interface AutofitTextOptions {
  min?: number;
  max?: number;
  target?: string | null;
  container?: 'parent' | 'self' | string;
  step?: number;
  singleLine?: boolean;
}

export interface DirectiveBindingLike<T = any> {
  value?: T;
}

export interface AutofitDirective {
  // Vue 3 hooks
  mounted?: (el: HTMLElement, binding: DirectiveBindingLike<AutofitTextOptions>) => void;
  updated?: (el: HTMLElement, binding: DirectiveBindingLike<AutofitTextOptions>) => void;
  unmounted?: (el: HTMLElement) => void;

  // Vue 2 hooks
  inserted?: (el: HTMLElement, binding: DirectiveBindingLike<AutofitTextOptions>) => void;
  componentUpdated?: (el: HTMLElement, binding: DirectiveBindingLike<AutofitTextOptions>) => void;
  unbind?: (el: HTMLElement) => void;
}

export interface VueDirectiveRegistrar {
  directive: (name: string, directive: AutofitDirective) => void;
}

export interface AutofitTextPluginOptions {
  name?: string;
}

export interface AutofitTextPlugin {
  install: (appOrVue: VueDirectiveRegistrar, options?: AutofitTextPluginOptions) => void;
}

export const autofitText: AutofitDirective;
export function createAutofitTextInstaller(
  directive: AutofitDirective,
): (appOrVue: VueDirectiveRegistrar, options?: AutofitTextPluginOptions) => boolean;
export function registerAutofitTextDirective(
  appOrVue: VueDirectiveRegistrar,
  directive: AutofitDirective,
  options?: AutofitTextPluginOptions,
): boolean;

declare const plugin: AutofitTextPlugin;
export default plugin;
