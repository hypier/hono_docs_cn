# Netlify

Netlify 提供静态网站托管和无服务器后端服务。[Edge Functions](https://docs.netlify.com/edge-functions/overview/) 使我们能够使网页动态化。

Edge Functions 支持使用 Deno 和 TypeScript 编写，并通过 [Netlify CLI](https://docs.netlify.com/cli/get-started/) 轻松部署。使用 Hono，您可以为 Netlify Edge Functions 创建应用程序。

## 1. 设置

Netlify 有一个启动器可用。  
使用 "create-hono" 命令启动您的项目。  
在此示例中选择 `netlify` 模板。

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

进入 `my-app`。

## 2. Hello World

编辑 `netlify/edge-functions/index.ts`:

```ts
import { Hono } from 'jsr:@hono/hono'
import { handle } from 'jsr:@hono/hono/netlify'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default handle(app)
```

## 3. 运行

使用 Netlify CLI 运行开发服务器。然后，在您的 Web 浏览器中访问 `http://localhost:8888`。

```sh
netlify dev
```

## 4. 部署

您可以使用 `netlify deploy` 命令进行部署。

```sh
netlify deploy --prod
```

## `Context`

您可以通过 `c.env` 访问 Netlify 的 `Context`：

```ts
import { Hono } from 'jsr:@hono/hono'
import { handle } from 'jsr:@hono/hono/netlify'

// Import the type definition
import type { Context } from 'https://edge.netlify.com/'

export type Env = {
  Bindings: {
    context: Context
  }
}

const app = new Hono<Env>()

app.get('/country', (c) =>
  c.json({
    'You are in': c.env.context.geo.country?.name,
  })
)

export default handle(app)
```