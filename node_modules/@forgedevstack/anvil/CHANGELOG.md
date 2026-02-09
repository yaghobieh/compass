# Changelog

All notable changes to this project will be documented in this file.

## [1.0.4] - 2026-02-09

### Added

#### New React Hooks
- **Network & Connectivity**:
  - `useOnline` - Detect online/offline network status with callbacks
  - `useWebSocket` - WebSocket connection management with auto-reconnect
- **User Activity**:
  - `useIdle` - Detect user inactivity with configurable timeout
  - `usePageVisibility` - Detect when page/tab is visible or hidden
- **Gestures**:
  - `useLongPress` - Detect long press gestures on elements

## [1.0.0] - 2026-01-19

### Added

#### Utility Functions
- **Type Guards**: `isUndefined`, `isNull`, `isNullOrUndefined`, `isDefined`, `isString`, `isNumber`, `isBoolean`, `isSymbol`, `isBigInt`, `isFunction`, `isAsyncFunction`, `isArray`, `isPlainObject`, `isObject`, `isDate`, `isValidDate`, `isRegExp`, `isMap`, `isSet`, `isWeakMap`, `isWeakSet`, `isPromise`, `isError`, `isEmpty`, `isPrimitive`, `isTruthy`, `isFalsy`, `isNaN`, `isFinite`, `isInteger`, `isPositive`, `isNegative`, `isZero`, `isEven`, `isOdd`
- **Clone Utilities**: `shallowClone`, `deepClone`, `deepFreeze`, `deepSeal`
- **Array Utilities**: `first`, `last`, `take`, `drop`, `takeLast`, `dropLast`, `compact`, `truthy`, `unique`, `flatten`, `flattenDeep`, `chunk`, `groupBy`, `find`, `findIndex`, `findLast`, `map`, `filter`, `sort`, `reverse`, `shuffle`, `intersection`, `difference`, `union`, `zip`, `sum`, `average`, `min`, `max`, `range`, `includesAll`, `includesAny`, `partition`, `countBy`, `at`, `uniqFlat`, `isEqual`, `insertAt`, `removeAt`, `move`, `swap`, `rotate`, `fill`, `isSorted`, `sample`, `frequency`, `uniqueOnly`, `duplicates`, `toArray`, `clean`, `ensureArray`, `nth`, `every`, `some`, `none`
- **Object Utilities**: `get`, `set`, `has`, `unset`, `pick`, `omit`, `pickBy`, `omitBy`, `keys`, `values`, `entries`, `fromEntries`, `merge`, `deepMerge`, `mapValues`, `mapKeys`, `filterObject`, `invert`, `flattenObject`, `unflattenObject`, `isEqual`, `defaults`, `defaultsDeep`, `transform`, `size`, `isEmpty`, `toMap`, `fromMap`, `renameKeys`, `zipObject`, `findKey`, `findKeyBy`, `forOwn`, `assignIf`, `computed`, `compact`, `compactDeep`, `ensure`
- **String Utilities**: `capitalize`, `uncapitalize`, `camelCase`, `pascalCase`, `snakeCase`, `kebabCase`, `constantCase`, `titleCase`, `sentenceCase`, `trim`, `trimStart`, `trimEnd`, `trimChars`, `padStart`, `padEnd`, `pad`, `truncate`, `truncateMiddle`, `repeat`, `reverse`, `countOccurrences`, `escapeRegExp`, `escapeHtml`, `unescapeHtml`, `slugify`, `unslugify`, `startsWith`, `endsWith`, `includes`, `isBlank`, `isNotBlank`, `isEmail`, `isUrl`, `isUuid`, `isNumeric`, `isAlphanumeric`, `removeWhitespace`, `collapseWhitespace`, `splitByMultiple`, `wordWrap`, `template`, `interpolate`, `mask`, `maskEmail`, `randomString`, `uuid`, `extractNumbers`, `extractWords`, `toBoolean`, `toNumber`, `pluralize`, `naturalCompare`, `levenshteinDistance`, `similarity`, `commonPrefix`, `commonSuffix`
- **Function Utilities**: `debounce`, `throttle`, `memoize`, `once`, `delay`, `retry`, `compose`, `pipe`, `curry`, `partial`, `negate`, `flip`, `over`, `allPass`, `anyPass`, `bind`, `asyncify`, `tryCatch`, `limit`, `timed`, `logged`, `after`, `before`, `wrap`, `sleep`, `timeout`, `withTimeout`, `identity`, `constant`, `noop`, `stubTrue`, `stubFalse`, `stubArray`, `stubObject`, `stubString`

#### React Hooks
- **Debounce & Throttle**: `useDebounce`, `useDebounceValue`, `useThrottle`, `useThrottleValue`
- **Responsive**: `useResponsive`, `useMediaQuery`, `useBreakpointUp`, `useBreakpointDown`, `useBreakpointBetween`, `useWindowSize`, `useOrientation`
- **Forms**: `useForm`, `useField`, `validators`
- **Storage**: `useLocalStorage`, `useSessionStorage`
- **Toggle**: `useToggle`, `useBoolean`, `useCycle`, `useDisclosure`
- **Previous Values**: `usePrevious`, `usePreviousDistinct`, `useHistory`, `useHasChanged`
- **Click Outside**: `useClickOutside`, `useClickOutsideMultiple`, `useHoverOutside`, `useEscapeKey`, `useFocusTrap`, `useClickPosition`
- **Async**: `useAsync`, `useFetch`, `useMutation`, `usePolling`, `useLazy`
- **Timers**: `useInterval`, `useTimeout`, `useCountdown`, `useStopwatch`, `useDelay`, `useRaf`
- **Lifecycle**: `useMounted`, `useUpdateEffect`, `useMountEffect`, `useUnmountEffect`, `useIsFirstRender`, `useForceUpdate`, `useRenderCount`, `useLifecycle`, `useSafeState`, `useDelayedRender`

#### Vue Composables
- `useDebounce`, `useThrottle`, `useResponsive`, `useMediaQuery`, `useLocalStorage`, `useToggle`, `useClickOutside`, `useInterval`, `useWindowSize`, `usePrevious`, `useMounted`, `useAsync`, `useCountdown`, `useEscapeKey`

#### Types
- Common types: `Primitive`, `Nullish`, `Falsy`, `AnyFunction`, `AnyObject`, `DeepPartial`, `DeepRequired`, `DeepReadonly`, `Mutable`, `DeepMutable`, `KeysOfType`, `OptionalKeys`, `RequiredKeys`, `PickByType`, `OmitByType`, `UnionToIntersection`, `Awaited`, `MaybePromise`, `MaybeArray`, `ElementOf`, `Path`, `PathValue`
- Array types: `ArrayCallback`, `ArrayPredicate`, `ArrayMapper`, `ArrayReducer`, `Comparator`, `SortOrder`, `SortConfig`, `GroupedResult`, `ChunkResult`, `UniqueByKey`, `FlattenDepth`, `Flatten`, `Tuple`, `Head`, `Tail`, `Last`, `Prepend`, `Append`
- Object types: `PropertyPath`, `NestedKeyOf`, `ObjectEntry`, `ObjectFromEntries`, `Merge`, `DeepMerge`, `Diff`, `Intersection`, `RenameKey`, `ValueOf`, `Entries`, `FromEntries`, `InvertObject`, `FlattenObject`, `PickNested`
- Function types: `AsyncFunction`, `VoidFunction`, `AsyncVoidFunction`, `Callback`, `ErrorCallback`, `SuccessCallback`, `Parameters`, `ReturnType`, `AwaitedReturnType`, `Curry`, `Partial`, `Debounced`, `Throttled`, `Memoized`, `Pipeline`, `Compose`
- Hook types: `Breakpoint`, `BreakpointConfig`, `ResponsiveState`, `FormFieldValue`, `FormValues`, `FormErrors`, `FormTouched`, `ValidationRule`, `ValidationRules`, `FormState`, `FormActions`, `UseFormReturn`, `UseDebounceOptions`, `UseThrottleOptions`, `UseLocalStorageOptions`, `UseToggleReturn`, `UseClickOutsideOptions`, `UseIntervalOptions`, `UseFetchState`, `UseFetchOptions`, `UseMediaQueryReturn`

#### Constants
- Numbers: `NUMBERS`, `DEBOUNCE_DELAY_MS`, `THROTTLE_INTERVAL_MS`, `DEFAULT_TIMEOUT_MS`, `ANIMATION_DURATION_MS`, `BREAKPOINTS`, `MAX_SAFE_INTEGER`, `MIN_SAFE_INTEGER`, file sizes (`KB`, `MB`, `GB`, `TB`), time constants (`MS_IN_SECOND`, etc.)
- Defaults: `DEFAULT_BREAKPOINT_CONFIG`, `DEFAULT_DEBOUNCE_OPTIONS`, `DEFAULT_THROTTLE_OPTIONS`, `DEFAULT_CLONE_OPTIONS`, `EMPTY_OBJECT`, `EMPTY_ARRAY`, `EMPTY_STRING`, `EMPTY_FUNCTION`, `IDENTITY_FUNCTION`, `NOOP`, `TRUE_FN`, `FALSE_FN`
- Strings: `TYPE_NAMES`, `OBJECT_TAGS`, `REGEX_PATTERNS`, `SPECIAL_CHARS`

