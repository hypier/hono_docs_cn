# Vercel

Vercel 是前端开发者的平台，提供创新者在灵感瞬间所需的速度和可靠性。本节介绍在 Vercel 上运行的 Next.js。

Next.js 是一个灵活的 React 框架，为您提供构建快速 Web 应用程序的基础构件。

在 Next.js 中，[Edge Functions](https://vercel.com/docs/concepts/functions/edge-functions) 允许您在像 Vercel 这样的 Edge Runtime 上创建动态 API。
使用 Hono，您可以使用与其他运行时相同的语法编写 API，并使用许多中间件。

## 1. 设置

可以使用 Next.js 的启动器。
使用 "create-hono" 命令开始您的项目。
选择 `nextjs` 模板作为本示例。

::: code-group

```sh [npm]
npm create hono@latest my-app
```

```sh [yarn]
yarn create hono my-app
```

```sh [pnpm]
pnpm create hono my-app
```

```sh [bun]
bunx create-hono my-app
```

```sh [deno]
deno run -A npm:create-hono my-app
```

:::

进入 `my-app` 并安装依赖。

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

## 2. Hello World

如果您使用 App Router，请编辑 `app/api/[[...route]]/route.ts`。有关更多选项，请参考 [支持的 HTTP 方法](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#supported-http-methods) 部分。

```ts
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

export const runtime = 'edge'

const app = new Hono().basePath('/api')

app.get('/hello', (c) => {
  return c.json({
    message: 'Hello Next.js!',
  })
})

export const GET = handle(app)
export const POST = handle(app)
```

如果您使用 Pages Router，请编辑 `pages/api/[[...route]].ts`。

```ts
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import type { PageConfig } from 'next'

export const config: PageConfig = {
  runtime: 'edge',
}

const app = new Hono().basePath('/api')

app.get('/hello', (c) => {
  return c.json({
    message: 'Hello Next.js!',
  })
})

export default handle(app)
```

## 3. 运行

在本地运行开发服务器。然后，在您的网页浏览器中访问 `http://localhost:3000`。

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

现在，`/api/hello` 仅返回 JSON，但如果您构建 React UI，您可以使用 Hono 创建一个全栈应用程序。

## 4. 部署

如果您有一个 Vercel 账户，您可以通过链接 Git 仓库进行部署。

## Node.js

您也可以在 Node.js 运行时上运行 Hono 与 Next.js。

首先，安装 Node.js 适配器。

```sh
npm i @hono/node-server
```

接下来，您可以利用从 `@hono/node-server/vercel` 导入的 `handle` 函数。

```ts
import { Hono } from 'hono'
import { handle } from '@hono/node-server/vercel'
import type { PageConfig } from 'next'

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
}

const app = new Hono().basePath('/api')

app.get('/hello', (c) => {
  return c.json({
    message: 'Hello from Hono!',
  })
})

export default handle(app)
```

为了使其正常工作，重要的是通过在项目仪表板或 `.env` 文件中设置环境变量来禁用 Vercel node.js 辅助工具。

`NODEJS_HELPERS=0`