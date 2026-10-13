declare module 'vue' {
  export function defineComponent(options: any): any;
  export function h(type: any, props?: any, children?: any): any;
  export function inject<T = any>(key: symbol | string, defaultValue?: T): T;
  export function provide(key: symbol | string, value: unknown): void;
  export function ref<T>(value: T): { value: T };
  export function computed<T>(getter: () => T): { readonly value: T };
  export function onUnmounted(fn: () => void): void;
}
