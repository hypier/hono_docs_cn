# Cloudflare Pages

[Cloudflare Pages](https://pages.cloudflare.com) 是一个用于全栈 web 应用程序的边缘平台。  
它提供由 Cloudflare Workers 提供的静态文件和动态内容。

Hono 完全支持 Cloudflare Pages。  
它带来了愉悦的开发体验。Vite 的开发服务器速度很快，使用 Wrangler 部署也非常迅速。

```
<code block content>
```

## 1. 设置

可以使用 Cloudflare Pages 的启动器。
使用 "create-hono" 命令开始您的项目。
在本示例中选择 `cloudflare-pages` 模板。

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

进入 `my-app` 目录并安装依赖。

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

以下是基本的目录结构。

```text
./
├── package.json
├── public
│   └── static // 放置您的静态文件。
│       └── style.css // 您可以将其引用为 `/static/style.css`。
├── src
│   ├── index.tsx // 服务器端的入口点。
│   └── renderer.tsx
├── tsconfig.json
└── vite.config.ts
```

## 2. 你好，世界

编辑 `src/index.tsx` 如下：

```tsx
import { Hono } from 'hono'
import { renderer } from './renderer'

const app = new Hono()

app.get('*', renderer)

app.get('/', (c) => {
  return c.render(<h1>Hello, Cloudflare Pages!</h1>)
})

export default app
```

## 3. 运行

在本地运行开发服务器。然后，在您的Web浏览器中访问 `http://localhost:5173`。

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

## 4. 部署

如果您有 Cloudflare 账户，您可以部署到 Cloudflare。在 `package.json` 中，`$npm_execpath` 需要更改为您选择的包管理器。

::: code-group

```sh [npm]
npm run deploy
```

```sh [yarn]
yarn deploy
```

```sh [pnpm]
pnpm run deploy
```

```sh [bun]
bun run deploy
```

:::

### Deploy with GitHub through Cloudflare Dashboard

1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com) and select your account.
2. On the account homepage, select Workers & Pages > Create Application > Pages > Connect to Git.
3. Authorize your GitHub account and select the repository. In the build and deployment settings, provide the following information:

| Configuration Option | Value             |
| ---------------------| ----------------- |
| Production Branch    | `main`           |
| Build Command        | `npm run build`  |
| Build Directory      | `dist`           |

## 绑定

您可以使用 Cloudflare 绑定，例如 Variables、KV、D1 等。在本节中，让我们使用 Variables 和 KV。

### 创建 `wrangler.toml`

首先，为本地 Bindings 创建 `wrangler.toml`：

```sh
touch wrangler.toml
```

编辑 `wrangler.toml`。指定变量名称为 `MY_NAME`。

```toml
[vars]
MY_NAME = "Hono"
```

### 创建 KV

接下来，创建 KV。运行以下 `wrangler` 命令：

```sh
wrangler kv namespace create MY_KV --preview
```

记下 `preview_id`，如下输出所示：

```
{ binding = "MY_KV", preview_id = "abcdef" }
```

使用绑定名称 `MY_KV` 指定 `preview_id`：

```toml
[[kv_namespaces]]
binding = "MY_KV"
id = "abcdef"
```

### 编辑 `vite.config.ts`

编辑 `vite.config.ts`：

```ts
import devServer from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/cloudflare'
import build from '@hono/vite-cloudflare-pages'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    devServer({
      entry: 'src/index.tsx',
      adapter, // Cloudflare Adapter
    }),
    build(),
  ],
})
```

### 在您的应用程序中使用绑定

在您的应用程序中使用变量和 KV。设置类型。

```ts
type Bindings = {
  MY_NAME: string
  MY_KV: KVNamespace
}

const app = new Hono<{ Bindings: Bindings }>()
```

使用它们：

```tsx
app.get('/', async (c) => {
  await c.env.MY_KV.put('name', c.env.MY_NAME)
  const name = await c.env.MY_KV.get('name')
  return c.render(<h1>Hello! {name}</h1>)
})
```

### 在生产环境中

对于 Cloudflare Pages，您将在本地开发中使用 `wrangler.toml`，但在生产环境中，您需要在仪表板中设置绑定。

## 客户端

您可以编写客户端脚本并使用 Vite 的功能将其导入到您的应用程序中。如果 `/src/client.ts` 是客户端的入口点，只需在 script 标签中写入即可。此外，`import.meta.env.PROD` 对于检测是否在开发服务器上运行或处于构建阶段非常有用。

```tsx
app.get('/', (c) => {
  return c.html(
    <html>
      <head>
        {import.meta.env.PROD ? (
          <script type='module' src='/static/client.js'></script>
        ) : (
          <script type='module' src='/src/client.ts'></script>
        )}
      </head>
      <body>
        <h1>Hello</h1>
      </body>
    </html>
  )
})
```

为了正确构建脚本，您可以使用下面的示例配置文件 `vite.config.ts`。

```ts
import pages from '@hono/vite-cloudflare-pages'
import devServer from '@hono/vite-dev-server'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => {
  if (mode === 'client') {
    return {
      build: {
        rollupOptions: {
          input: './src/client.ts',
          output: {
            entryFileNames: 'static/client.js',
          },
        },
      },
    }
  } else {
    return {
      plugins: [
        pages(),
        devServer({
          entry: 'src/index.tsx',
        }),
      ],
    }
  }
})
```

您可以运行以下命令来构建服务器和客户端脚本。

```sh
vite build --mode client && vite build
```

## Cloudflare Pages 中间件

Cloudflare Pages 使用其自己的 [中间件](https://developers.cloudflare.com/pages/functions/middleware/) 系统，这与 Hono 的中间件不同。您可以通过在名为 `_middleware.ts` 的文件中导出 `onRequest` 来启用它，如下所示：

```ts
// functions/_middleware.ts
export async function onRequest(pagesContext) {
  console.log(`You are accessing ${pagesContext.request.url}`)
  return await pagesContext.next()
}
```

使用 `handleMiddleware`，您可以将 Hono 的中间件用作 Cloudflare Pages 中间件。

```ts
// functions/_middleware.ts
import { handleMiddleware } from 'hono/cloudflare-pages'

export const onRequest = handleMiddleware(async (c, next) => {
  console.log(`You are accessing ${c.req.url}`)
  await next()
})
```

您还可以使用 Hono 的内置和第三方中间件。例如，要添加基本身份验证，您可以使用 [Hono 的基本身份验证中间件](/docs/middleware/builtin/basic-auth)。

```ts
// functions/_middleware.ts
import { handleMiddleware } from 'hono/cloudflare-pages'
import { basicAuth } from 'hono/basic-auth'

export const onRequest = handleMiddleware(
  basicAuth({
    username: 'hono',
    password: 'acoolproject',
  })
)
```

如果您想应用多个中间件，可以这样写：

```ts
import { handleMiddleware } from 'hono/cloudflare-pages'

// ...

export const onRequest = [
  handleMiddleware(middleware1),
  handleMiddleware(middleware2),
  handleMiddleware(middleware3),
]
```