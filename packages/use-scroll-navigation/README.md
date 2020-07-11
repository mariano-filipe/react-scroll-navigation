# useScrollNavigation

### A React Hook for getting the first visible element in a scrollable container

[![Minified file size](https://img.shields.io/bundlephobia/min/use-scroll-navigation)](https://bundlephobia.com/result?p=use-scroll-navigation) [![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT) [![NPM version](https://img.shields.io/npm/v/use-scroll-navigation)](https://www.npmjs.com/package/use-scroll-navigation)

---

## Installation

Package can be added using **yarn**:

```bash
yarn add use-scroll-navigation
```

Or, use **NPM**:

```bash
npm install use-scroll-navigation
```

---

## API Documentation

The `useScrollNavigation` hook takes an object with at most three properties:

| Name                 | Value                 |
| -------------------  | --------------------- |
| scrollableTargets    | HTMLElement[]         |
| scrollableContainer  | ?EventTarget = window |
| offsetTop            | ?number = 0           |

- `scrollableTargets` is an array of HTMLElements which you want to sync with the user scroll position.
- `scrollableContainer` is the scrollable element for which you want to monitor scroll events. Defaults to 'window'.
- `offsetTop` is a number which will be added in the computation of the top offsets for each target. Useful for compensating *position: fixed* elements (e.g. an app bar) at the top of the container which don't contribute directly to the container's height. Defaults to 0.

### Exposed Data

The hook produces an object with the following fields:

| Name              | Value                                                    |
| ----------------- | -------------------------------------------------------- |
| hitTargetIndex    | number                                                   |
| scrollTo          | (targetIndex: number, options?: ScrollToOptions) => void |

- `hitTargetIndex` is the first visible (top to bottom) element in the container.
- `scrollTo` is offered as a replacement of the equivalent browser API. It automatically handles
scrolling to unreachable targets.
