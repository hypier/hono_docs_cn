# 客户端组件

`hono/jsx` 不仅支持服务器端，还支持客户端。这意味着可以创建在浏览器中运行的交互式用户界面。我们称之为客户端组件或 `hono/jsx/dom`。

它快速且体积非常小。`hono/jsx/dom` 中的计数器程序仅为 2.8KB，经过 Brotli 压缩。而 React 的体积则为 47.8KB。

本节介绍客户端组件特定的功能。

## 反例

这是一个简单计数器的示例，代码与 React 中的相同。

```tsx
import { useState } from 'hono/jsx'
import { render } from 'hono/jsx/dom'

function Counter() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  )
}

function App() {
  return (
    <html>
      <body>
        <Counter />
      </body>
    </html>
  )
}

const root = document.getElementById('root')
render(<App />, root)
```

## `render()`

您可以使用 `render()` 在指定的 HTML 元素中插入 JSX 组件。

```tsx
render(<Component />, container)
```

## 与 React 兼容的 Hooks

hono/jsx/dom 提供了与 React 兼容或部分兼容的 Hooks。您可以通过查看 [React 文档](https://react.dev/reference/react/hooks) 来了解这些 API。

- `useState()`
- `useEffect()`
- `useRef()`
- `useCallback()`
- `use()`
- `startTransition()`
- `useTransition()`
- `useDeferredValue()`
- `useMemo()`
- `useLayoutEffect()`
- `useReducer()`
- `useDebugValue()`
- `createElement()`
- `memo()`
- `isValidElement()`
- `useId()`
- `createRef()`
- `forwardRef()`
- `useImperativeHandle()`
- `useSyncExternalStore()`
- `useInsertionEffect()`
- `useFormStatus()`
- `useActionState()`
- `useOptimistic()`

## `startViewTransition()` 家族

`startViewTransition()` 家族包含原始钩子和函数，以便轻松处理 [View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API)。以下是如何使用它们的示例。

### 1. 最简单的例子

您可以使用 `document.startViewTransition` 简短地编写一个过渡，使用 `startViewTransition()`。

```tsx
import { useState, startViewTransition } from 'hono/jsx'
import { css, Style } from 'hono/css'

export default function App() {
  const [showLargeImage, setShowLargeImage] = useState(false)
  return (
    <>
      <Style />
      <button
        onClick={() =>
          startViewTransition(() =>
            setShowLargeImage((state) => !state)
          )
        }
      >
        点击！
      </button>
      <div>
        {!showLargeImage ? (
          <img src='https://hono.dev/images/logo.png' />
        ) : (
          <div
            class={css`
              background: url('https://hono.dev/images/logo-large.png');
              background-size: contain;
              background-repeat: no-repeat;
              background-position: center;
              width: 600px;
              height: 600px;
            `}
          ></div>
        )}
      </div>
    </>
  )
}
```

### 2. 使用 `viewTransition()` 和 `keyframes()`

`viewTransition()` 函数允许您获取唯一的 `view-transition-name`。

您可以将其与 `keyframes()` 一起使用，`::view-transition-old()` 被转换为 `::view-transition-old(${uniqueName})`。

```tsx
import { useState, startViewTransition } from 'hono/jsx'
import { viewTransition } from 'hono/jsx/dom/css'
import { css, keyframes, Style } from 'hono/css'

const rotate = keyframes`
  from {
    rotate: 0deg;
  }
  to {
    rotate: 360deg;
  }
`

export default function App() {
  const [showLargeImage, setShowLargeImage] = useState(false)
  const [transitionNameClass] = useState(() =>
    viewTransition(css`
      ::view-transition-old() {
        animation-name: ${rotate};
      }
      ::view-transition-new() {
        animation-name: ${rotate};
      }
    `)
  )
  return (
    <>
      <Style />
      <button
        onClick={() =>
          startViewTransition(() =>
            setShowLargeImage((state) => !state)
          )
        }
      >
        Click!
      </button>
      <div>
        {!showLargeImage ? (
          <img src='https://hono.dev/images/logo.png' />
        ) : (
          <div
            class={css`
              ${transitionNameClass}
              background: url('https://hono.dev/images/logo-large.png');
              background-size: contain;
              background-repeat: no-repeat;
              background-position: center;
              width: 600px;
              height: 600px;
            `}
          ></div>
        )}
      </div>
    </>
  )
}
```

### 3. 使用 `useViewTransition`

如果您只想在动画期间更改样式，可以使用 `useViewTransition()`。此钩子返回 `[boolean, (callback: () => void) => void]`，它们分别是 `isUpdating` 标志和 `startViewTransition()` 函数。

当使用此钩子时，组件在以下两个时刻被评估。

- 在调用 `startViewTransition()` 的回调内部。
- 当 [ `finish` promise 被满足时](https://developer.mozilla.org/en-US/docs/Web/API/ViewTransition/finished)

```tsx
import { useState, useViewTransition } from 'hono/jsx'
import { viewTransition } from 'hono/jsx/dom/css'
import { css, keyframes, Style } from 'hono/css'

const rotate = keyframes`
  from {
    rotate: 0deg;
  }
  to {
    rotate: 360deg;
  }
`

export default function App() {
  const [isUpdating, startViewTransition] = useViewTransition()
  const [showLargeImage, setShowLargeImage] = useState(false)
  const [transitionNameClass] = useState(() =>
    viewTransition(css`
      ::view-transition-old() {
        animation-name: ${rotate};
      }
      ::view-transition-new() {
        animation-name: ${rotate};
      }
    `)
  )
  return (
    <>
      <Style />
      <button
        onClick={() =>
          startViewTransition(() =>
            setShowLargeImage((state) => !state)
          )
        }
      >
        点击！
      </button>
      <div>
        {!showLargeImage ? (
          <img src='https://hono.dev/images/logo.png' />
        ) : (
          <div
            class={css`
              ${transitionNameClass}
              background: url('https://hono.dev/images/logo-large.png');
              background-size: contain;
              background-repeat: no-repeat;
              background-position: center;
              width: 600px;
              height: 600px;
              position: relative;
              ${isUpdating &&
              css`
                &:before {
                  content: '加载中...';
                  position: absolute;
                  top: 50%;
                  left: 50%;
                }
              `}
            `}
          ></div>
        )}
      </div>
    </>
  )
}
```

## `hono/jsx/dom` 运行时

这是一个用于客户端组件的小型 JSX 运行时。使用它将比使用 `hono/jsx` 产生更小的打包结果。在 `tsconfig.json` 中指定 `hono/jsx/dom`。

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "hono/jsx/dom"
  }
}
```