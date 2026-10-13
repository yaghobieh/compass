# Changelog

All notable changes to @forgedevstack/forge-compass will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.4] - 2026-10-13

### Added

- **One-shot `createRoute`** — object form `{ name, fn, path, component }` and string form `auth function /auth/:id <UserPage>`. Component names resolve through `registerComponent` / `getComponent`, or stay as strings until `resolveRouteComponents` or the view renders them.
- **Vue, Angular, and Svelte entry points** — `@forgedevstack/forge-compass/vue`, `/angular`, and `/svelte`. React remains the default export.
- Framework-agnostic route records so those adapters do not import React.

## [1.0.3] - 2026-03-28

### Fixed

- **Browser back/forward** — On `popstate`, navigation no longer calls `history.replaceState`, so the URL stack matches the user’s history and the back button works as expected.
- **`NavigateOptions.skipHistoryUpdate`** — Internal option to sync router state from the browser without mutating history; used by the popstate handler.

## [1.0.2] and earlier

See git history and `package.json` version tags for prior releases.
