# 开始使用

使用 Hono 非常简单。我们可以设置项目、编写代码、在本地服务器上开发并快速部署。相同的代码可以在任何运行时上工作，只需不同的入口点。让我们来看看 Hono 的基本用法。

```
const app = new Hono()

app.get('/', (c) => c.text('Hello World!'))

app.listen(3000)
```

## 启动器

每个平台都有可用的启动模板。使用以下 "create-hono" 命令。

::: code-group

```sh [npm]
npm create hono@latest my-app
```

```sh [yarn]
yarn create hono my-app
```

```sh [pnpm]
pnpm create hono@latest my-app
```

```sh [bun]
bun create hono@latest my-app
```

```sh [deno]
deno run -A npm:create-hono@latest my-app
```

:::

然后系统会询问您想使用哪个模板。
在这个例子中，我们选择 Cloudflare Workers。

```
? Which template do you want to use?
    aws-lambda
    bun
    cloudflare-pages
❯   cloudflare-workers
    deno
    fastly
    nextjs
    nodejs
    vercel
```

模板将被拉取到 `my-app` 中，因此请进入该目录并安装依赖项。

::: code-group

```sh [npm]
cd my-app
npm i
```

```sh [yarn]
cd my-app
yarn
```

```sh [pnpm]
cd my-app
pnpm i
```

```sh [bun]
cd my-app
bun i
```

:::

一旦包安装完成，运行以下命令以启动本地服务器。

::: code-group

```sh [npm]
npm run dev
```

```sh [yarn]
yarn dev
```

```sh [pnpm]
pnpm dev
```

```sh [bun]
bun run dev
```

:::

## Hello World

您可以使用 Cloudflare Workers 开发工具 "Wrangler"，Deno，Bun 或其他工具在 TypeScript 中编写代码，而无需了解转译。

在 `src/index.ts` 中编写您的第一个应用程序。下面的示例是一个基础的 Hono 应用程序。

`import` 和最终的 `export default` 部分可能因运行时而异，但所有应用程序代码将在任何地方运行相同的代码。

```ts
import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default app
```

启动开发服务器，并使用浏览器访问 `http://localhost:8787`。

::: code-group

```sh [npm]
npm run dev
```

```sh [yarn]
yarn dev
```

```sh [pnpm]
pnpm dev
```

```sh [bun]
bun run dev
```

:::

## 返回 JSON

返回 JSON 也很简单。以下是处理对 `/api/hello` 的 GET 请求并返回 `application/json` 响应的示例。

```ts
app.get('/api/hello', (c) => {
  return c.json({
    ok: true,
    message: 'Hello Hono!',
  })
})
```

## 请求与响应

获取路径参数、URL 查询值并添加响应头的代码如下。

```ts
app.get('/posts/:id', (c) => {
  const page = c.req.query('page')
  const id = c.req.param('id')
  c.header('X-Message', 'Hi!')
  return c.text(`You want see ${page} of ${id}`)
})
```

我们不仅可以轻松处理 GET 请求，还可以处理 POST、PUT 和 DELETE 请求。

```ts
app.post('/posts', (c) => c.text('Created!', 201))
app.delete('/posts/:id', (c) =>
  c.text(`${c.req.param('id')} is deleted!`)
)
```

## 返回 HTML

Hono 也适合返回一些 HTML。将文件重命名为 `src/index.tsx` 并配置为使用 JSX（请根据每个运行时进行检查，因为它们各不相同）。您不需要使用一个庞大的前端框架。

```tsx
const View = () => {
  return (
    <html>
      <body>
        <h1>Hello Hono!</h1>
      </body>
    </html>
  )
}

app.get('/page', (c) => {
  return c.html(<View />)
})
```

## 返回原始响应

您还可以返回原始 [Response](https://developer.mozilla.org/zh-CN/docs/Web/API/Response)。

```ts
app.get('/', (c) => {
  return new Response('Good morning!')
})
```

## 使用中间件

中间件可以为您完成繁重的工作。
例如，添加基本认证。

```ts
import { basicAuth } from 'hono/basic-auth'

// ...

app.use(
  '/admin/*',
  basicAuth({
    username: 'admin',
    password: 'secret',
  })
)

app.get('/admin', (c) => {
  return c.text('You are authorized!')
})
```

有一些有用的内置中间件，包括 Bearer 认证和使用 JWT 的认证、CORS 和 ETag。
Hono 还提供使用外部库的第三方中间件，例如 GraphQL Server 和 Firebase Auth。
此外，您还可以创建自己的中间件。

## 适配器

有适配器用于平台相关的功能，例如处理静态文件或 WebSocket。
例如，要在 Cloudflare Workers 中处理 WebSocket，请导入 `hono/cloudflare-workers`。

```ts
import { upgradeWebSocket } from 'hono/cloudflare-workers'

app.get(
  '/ws',
  upgradeWebSocket((c) => {
    // ...
  })
)
```

## 下一步

大多数代码可以在任何平台上运行，但每个平台都有相应的指南。
例如，如何设置项目或如何部署。
请查看您想要使用来创建应用程序的确切平台页面！

```
# 示例代码
print("Hello, World!")
```