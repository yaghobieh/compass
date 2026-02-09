# ⚒️ Anvil

<p align="center">
  <img src="./icons/logo.svg" alt="Anvil Logo" width="120" height="120">
</p>

<p align="center">
  <strong>A modern utility library with React hooks and Vue composables</strong>
  <br>
  <em>The forge where code is shaped</em>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@forgedevstack/anvil"><img src="https://img.shields.io/npm/v/@forgedevstack/anvil.svg" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/@forgedevstack/anvil"><img src="https://img.shields.io/npm/dm/@forgedevstack/anvil.svg" alt="npm downloads"></a>
  <a href="https://github.com/yaghobieh/anvil/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@forgedevstack/anvil.svg" alt="license"></a>
</p>

---

## ✨ Features

- 🔧 **100+ Utility Functions** - Deep clone, type guards, array/object manipulation, string utilities
- ⚛️ **React Hooks** - useResponsive, useForm, useDebounce, useThrottle, and many more
- 💚 **Vue Composables** - First-class Vue 3 support with reactivity
- 🎯 **TypeScript First** - Full type safety with comprehensive type utilities
- 📦 **Tree-shakeable** - Import only what you need
- 🚀 **Zero Dependencies** - Lightweight and fast
- 🌐 **Framework Agnostic** - Works with React, Vue, Angular, Node.js, and vanilla JS

## 📦 Installation

```bash
npm install @forgedevstack/anvil
```

```bash
yarn add @forgedevstack/anvil
```

```bash
pnpm add @forgedevstack/anvil
```

## 🚀 Quick Start

### Utility Functions

```typescript
import {
  deepClone,
  isNullOrUndefined,
  debounce,
  throttle,
  camelCase,
  unique,
  groupBy,
} from '@forgedevstack/anvil';

const cloned = deepClone({ nested: { data: [1, 2, 3] } });

const debouncedSearch = debounce((query: string) => {
  console.log('Searching:', query);
}, 300);

const uniqueItems = unique([1, 2, 2, 3, 3, 3]);

const grouped = groupBy(users, 'role');
```

### React Hooks

```tsx
import {
  useResponsive,
  useDebounce,
  useForm,
  useLocalStorage,
  useToggle,
} from '@forgedevstack/anvil';

function MyComponent() {
  const { isMobile, isDesktop, breakpoint } = useResponsive();

  const [theme, setTheme] = useLocalStorage('theme', 'dark');

  const [isOpen, toggle] = useToggle(false);

  const { values, setValue, handleSubmit, errors } = useForm({
    email: '',
    password: '',
  });

  const { call: debouncedSearch } = useDebounce(
    (query: string) => fetchResults(query),
    { delay: 300 }
  );

  return (
    <div>
      {isMobile ? <MobileView /> : <DesktopView />}
    </div>
  );
}
```

### Vue Composables

```vue
<script setup lang="ts">
import { useResponsive, useDebounce, useToggle } from '@forgedevstack/anvil/hooks/vue';

const { isMobile, isDesktop } = useResponsive();
const { value: isOpen, toggle } = useToggle(false);

const searchQuery = ref('');
const debouncedQuery = useDebounce(searchQuery, 300);
</script>
```

## 📚 API Reference

### Type Guards

```typescript
isUndefined(value)
isNull(value)
isNullOrUndefined(value)
isDefined(value)
isString(value)
isNumber(value)
isBoolean(value)
isArray(value)
isPlainObject(value)
isFunction(value)
isDate(value)
isEmpty(value)
isPrimitive(value)
```

### Clone Utilities

```typescript
deepClone(value)
shallowClone(value)
deepFreeze(object)
deepSeal(object)
```

### Array Utilities

```typescript
first(arr)
last(arr)
take(arr, n)
drop(arr, n)
unique(arr, key?)
chunk(arr, size)
groupBy(arr, key)
flatten(arr, depth?)
intersection(arr1, arr2)
difference(arr1, arr2)
union(arr1, arr2)
shuffle(arr)
sample(arr, count?)
partition(arr, predicate)
```

### Object Utilities

```typescript
get(obj, path, defaultValue?)
set(obj, path, value)
has(obj, path)
pick(obj, keys)
omit(obj, keys)
merge(...objects)
deepMerge(...objects)
mapValues(obj, mapper)
flattenObject(obj, separator?)
isEqual(obj1, obj2)
```

### String Utilities

```typescript
capitalize(str)
camelCase(str)
pascalCase(str)
snakeCase(str)
kebabCase(str)
slugify(str)
truncate(str, length, suffix?)
escapeHtml(str)
uuid()
```

### Function Utilities

```typescript
debounce(fn, delay, options?)
throttle(fn, interval, options?)
memoize(fn, keyResolver?)
once(fn)
curry(fn)
compose(...fns)
pipe(...fns)
retry(fn, retries?, delay?)
```

### React Hooks

```typescript
useDebounce(callback, options)
useDebounceValue(value, delay)
useThrottle(callback, options)
useResponsive(breakpoints?)
useMediaQuery(query)
useForm(initialValues, rules?)
useLocalStorage(key, initialValue)
useSessionStorage(key, initialValue)
useToggle(initialValue?)
useBoolean(initialValue?)
usePrevious(value)
useClickOutside(handler, options?)
useEscapeKey(handler)
useFetch(url, options?)
useAsync(asyncFn, options?)
useInterval(callback, delay, options?)
useTimeout(callback, delay)
useCountdown(seconds, onComplete?)
useMounted()
useForceUpdate()
```

### Vue Composables

```typescript
useDebounce(value, delay)
useThrottle(value, interval)
useResponsive(breakpoints?)
useMediaQuery(query)
useLocalStorage(key, initialValue)
useToggle(initialValue?)
useClickOutside(handler)
useInterval(callback, delay)
useWindowSize()
usePrevious(value)
useMounted()
useAsync(asyncFn)
useCountdown(seconds)
useEscapeKey(handler)
```

### Types

```typescript
type DeepPartial<T>
type DeepRequired<T>
type DeepReadonly<T>
type Mutable<T>
type KeysOfType<T, V>
type PickByType<T, V>
type OmitByType<T, V>
type UnionToIntersection<U>
type MaybePromise<T>
type MaybeArray<T>
type Path<T>
type PathValue<T, P>
```

## 🎨 Philosophy

Anvil is designed with the following principles:

1. **Simplicity** - Clear, readable APIs that do one thing well
2. **Type Safety** - Comprehensive TypeScript support throughout
3. **Performance** - Optimized implementations with minimal overhead
4. **Flexibility** - Works with any framework or vanilla JavaScript
5. **Consistency** - Unified API design across utilities and hooks

## 📄 License

MIT © [John Yaghobieh](https://github.com/yaghobieh)

---

<p align="center">
  Part of the <a href="https://forgedevstack.dev">ForgeStack</a> ecosystem
</p>

