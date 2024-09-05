# JSX

您可以使用 `hono/jsx` 以 JSX 语法编写 HTML。

尽管 `hono/jsx` 可以在客户端工作，但您可能会在服务器端渲染内容时最常使用它。以下是一些与 JSX 相关的内容，这些内容在服务器和客户端中都是常见的。

## 设置

要使用 JSX，请修改 `tsconfig.json`：

`tsconfig.json`：

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "hono/jsx"
  }
}
```

或者，使用 pragma 指令：

```ts
/** @jsx jsx */
/** @jsxImportSource hono/jsx */
```

对于 Deno，您需要修改 `deno.json` 而不是 `tsconfig.json`：

```json
{
  "compilerOptions": {
    "jsx": "precompile",
    "jsxImportSource": "hono/jsx"
  }
}
```

## 用法

`index.tsx`:

```tsx
import { Hono } from 'hono'
import type { FC } from 'hono/jsx'

const app = new Hono()

const Layout: FC = (props) => {
  return (
    <html>
      <body>{props.children}</body>
    </html>
  )
}

const Top: FC<{ messages: string[] }> = (props: {
  messages: string[]
}) => {
  return (
    <Layout>
      <h1>你好 Hono!</h1>
      <ul>
        {props.messages.map((message) => {
          return <li>{message}!!</li>
        })}
      </ul>
    </Layout>
  )
}

app.get('/', (c) => {
  const messages = ['早上好', '晚上好', '晚安']
  return c.html(<Top messages={messages} />)
})

export default app
```

## Fragment

使用 Fragment 来分组多个元素而不添加额外的节点：

```tsx
import { Fragment } from 'hono/jsx'

const List = () => (
  <Fragment>
    <p>first child</p>
    <p>second child</p>
    <p>third child</p>
  </Fragment>
)
```

或者，如果设置正确，您可以使用 `<></>` 来编写。

```tsx
const List = () => (
  <>
    <p>first child</p>
    <p>second child</p>
    <p>third child</p>
  </>
)
```

## `PropsWithChildren`

您可以使用 `PropsWithChildren` 正确推断函数组件中的子元素。

```tsx
import { PropsWithChildren } from 'hono/jsx'

type Post = {
  id: number
  title: string
}

function Component({ title, children }: PropsWithChildren<Post>) {
  return (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  )
}
```

## 插入原始 HTML

要直接插入 HTML，请使用 `dangerouslySetInnerHTML`：

```tsx
app.get('/foo', (c) => {
  const inner = { __html: 'JSX &middot; SSR' }
  const Div = <div dangerouslySetInnerHTML={inner} />
})
```

## 记忆化

通过使用 `memo` 对计算字符串进行记忆化来优化您的组件：

```tsx
import { memo } from 'hono/jsx'

const Header = memo(() => <header>Welcome to Hono</header>)
const Footer = memo(() => <footer>Powered by Hono</footer>)
const Layout = (
  <div>
    <Header />
    <p>Hono is cool!</p>
    <Footer />
  </div>
)
```

## 上下文

通过使用 `useContext`，您可以在组件树的任何层级中全局共享数据，而无需通过 props 传递值。

```tsx
import type { FC } from 'hono/jsx'
import { createContext, useContext } from 'hono/jsx'

const themes = {
  light: {
    color: '#000000',
    background: '#eeeeee',
  },
  dark: {
    color: '#ffffff',
    background: '#222222',
  },
}

const ThemeContext = createContext(themes.light)

const Button: FC = () => {
  const theme = useContext(ThemeContext)
  return <button style={theme}>Push!</button>
}

const Toolbar: FC = () => {
  return (
    <div>
      <Button />
    </div>
  )
}

// ...

app.get('/', (c) => {
  return c.html(
    <div>
      <ThemeContext.Provider value={themes.dark}>
        <Toolbar />
      </ThemeContext.Provider>
    </div>
  )
})
```

## Async Component

`hono/jsx` 支持异步组件，因此您可以在组件中使用 `async`/`await`。
如果您使用 `c.html()` 渲染它，它会自动等待。

```tsx
const AsyncComponent = async () => {
  await new Promise((r) => setTimeout(r, 1000)) // sleep 1s
  return <div>Done!</div>
}

app.get('/', (c) => {
  return c.html(
    <html>
      <body>
        <AsyncComponent />
      </body>
    </html>
  )
})
```

## 悬念 <Badge style="vertical-align: middle;" type="warning" text="实验性" />

类似于 React 的 `Suspense` 功能可用。
如果将异步组件包装在 `Suspense` 中，回退内容将首先渲染，一旦 Promise 被解决，等待的内容将会显示。
您可以与 `renderToReadableStream()` 一起使用。

```tsx
import { renderToReadableStream, Suspense } from 'hono/jsx/streaming'

//...

app.get('/', (c) => {
  const stream = renderToReadableStream(
    <html>
      <body>
        <Suspense fallback={<div>loading...</div>}>
          <Component />
        </Suspense>
      </body>
    </html>
  )
  return c.body(stream, {
    headers: {
      'Content-Type': 'text/html; charset=UTF-8',
      'Transfer-Encoding': 'chunked',
    },
  })
})
```

## ErrorBoundary <Badge style="vertical-align: middle;" type="warning" text="实验性" />

您可以使用 `ErrorBoundary` 捕获子组件中的错误。

在下面的示例中，如果发生错误，将显示在 `fallback` 中指定的内容。

```tsx
function SyncComponent() {
  throw new Error('Error')
  return <div>Hello</div>
}

app.get('/sync', async (c) => {
  return c.html(
    <html>
      <body>
        <ErrorBoundary fallback={<div>服务不可用</div>}>
          <SyncComponent />
        </ErrorBoundary>
      </body>
    </html>
  )
})
```

`ErrorBoundary` 也可以与异步组件和 `Suspense` 一起使用。

```tsx
async function AsyncComponent() {
  await new Promise((resolve) => setTimeout(resolve, 2000))
  throw new Error('Error')
  return <div>Hello</div>
}

app.get('/with-suspense', async (c) => {
  return c.html(
    <html>
      <body>
        <ErrorBoundary fallback={<div>服务不可用</div>}>
          <Suspense fallback={<div>加载中...</div>}>
            <AsyncComponent />
          </Suspense>
        </ErrorBoundary>
      </body>
    </html>
  )
})
```

## 与 HTML 中间件集成

结合 JSX 和 HTML 中间件以实现强大的模板功能。
有关详细信息，请查阅 [html middleware documentation](/docs/helpers/html)。

```tsx
import { Hono } from 'hono'
import { html } from 'hono/html'

const app = new Hono()

interface SiteData {
  title: string
  children?: any
}

const Layout = (props: SiteData) =>
  html`<!doctype html>
    <html>
      <head>
        <title>${props.title}</title>
      </head>
      <body>
        ${props.children}
      </body>
    </html>`

const Content = (props: { siteData: SiteData; name: string }) => (
  <Layout {...props.siteData}>
    <h1>Hello {props.name}</h1>
  </Layout>
)

app.get('/:name', (c) => {
  const { name } = c.req.param()
  const props = {
    name: name,
    siteData: {
      title: 'JSX with html sample',
    },
  }
  return c.html(<Content {...props} />)
})

export default app
```

## 使用 JSX 渲染器中间件

[JSX 渲染器中间件](/docs/middleware/builtin/jsx-renderer) 使您能够更轻松地使用 JSX 创建 HTML 页面。

## 重写类型定义

您可以重写类型定义以添加自定义元素和属性。

```ts
declare module 'hono/jsx' {
  namespace JSX {
    interface IntrinsicElements {
      'my-custom-element': HTMLAttributes & {
        'x-event'?: 'click' | 'scroll'
      }
    }
  }
}
```