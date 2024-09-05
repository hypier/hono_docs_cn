# Cloudflare Workers

[Cloudflare Workers](https://workers.cloudflare.com) 是 Cloudflare CDN 上的 JavaScript 边缘运行时。

您可以在本地开发应用程序，并使用 [Wrangler](https://developers.cloudflare.com/workers/wrangler/) 通过几个命令发布它。
Wrangler 包含转译器，因此我们可以使用 TypeScript 编写代码。

让我们使用 Hono 创建您的第一个 Cloudflare Workers 应用程序。

## 1. 设置

可以使用 Cloudflare Workers 的启动器。  
使用 "create-hono" 命令开始您的项目。  
选择 `cloudflare-workers` 模板作为本示例。

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

## 2. 你好，世界

编辑 `src/index.ts` 如下所示。

```ts
import { Hono } from 'hono'
const app = new Hono()

app.get('/', (c) => c.text('Hello Cloudflare Workers!'))

export default app
```

## 3. 运行

在本地运行开发服务器。然后，在您的网页浏览器中访问 `http://localhost:8787`。

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

如果您有一个 Cloudflare 账户，您可以部署到 Cloudflare。在 `package.json` 中，`$npm_execpath` 需要更改为您选择的包管理器。

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

就是这样！

## Service Worker 模式或 Module Worker 模式

有两种语法用于编写 Cloudflare Workers。_Module Worker 模式_和 _Service Worker 模式_。使用 Hono，您可以使用这两种语法进行编写，但我们建议使用 Module Worker 模式，以便绑定变量是局部的。

```ts
// Module Worker
export default app
```

```ts
// Service Worker
app.fire()
```

## 在其他事件处理程序中使用 Hono

您可以在 _模块 Worker 模式_ 中将 Hono 与其他事件处理程序（例如 `scheduled`）集成。

为此，将 `app.fetch` 导出为模块的 `fetch` 处理程序，然后根据需要实现其他处理程序：

```ts
const app = new Hono()

export default {
  fetch: app.fetch,
  scheduled: async (batch, env) => {},
}
```

## 提供静态文件

::: warning
此“提供静态文件”功能已被 Cloudflare Workers 弃用。如果您想创建一个提供静态资源文件的应用程序，请使用 [Cloudflare Pages](/docs/getting-started/cloudflare-pages) 而不是 Cloudflare Workers。
:::

您需要设置以提供静态文件。
静态文件通过 Workers Sites 分发。
要启用此功能，请编辑 `wrangler.toml` 并指定静态文件将放置的目录。

```toml
[site]
bucket = "./assets"
```

然后创建 `assets` 目录并将文件放置在其中。

```
./
├── assets
│   ├── favicon.ico
│   └── static
│       ├── demo
│       │   └── index.html
│       ├── fallback.txt
│       └── images
│           └── dinotocat.png
├── package.json
├── src
│   └── index.ts
└── wrangler.toml
```

然后使用“适配器”。

```ts
import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'
import manifest from '__STATIC_CONTENT_MANIFEST'

const app = new Hono()

app.get('/static/*', serveStatic({ root: './', manifest }))
app.get('/favicon.ico', serveStatic({ path: './favicon.ico' }))
```

### `rewriteRequestPath`

如果您想将 `http://localhost:8787/static/*` 映射到 `./assets/statics`，您可以使用 `rewriteRequestPath` 选项：

```ts
app.get(
  '/static/*',
  serveStatic({
    root: './',
    rewriteRequestPath: (path) =>
      path.replace(/^\/static/, '/statics'),
  })
)
```

### `mimes`

您可以使用 `mimes` 添加 MIME 类型：

```ts
app.get(
  '/static/*',
  serveStatic({
    mimes: {
      m3u8: 'application/vnd.apple.mpegurl',
      ts: 'video/mp2t',
    },
  })
)
```

### `onNotFound`

您可以使用 `onNotFound` 指定在请求的文件未找到时的处理方式：

```ts
app.get(
  '/static/*',
  serveStatic({
    onNotFound: (path, c) => {
      console.log(`${path} is not found, you access ${c.req.path}`)
    },
  })
)
```

## 类型

您必须安装 `@cloudflare/workers-types` 如果您想要使用工作类型。

::: code-group

```sh [npm]
npm i --save-dev @cloudflare/workers-types
```

```sh [yarn]
yarn add -D @cloudflare/workers-types
```

```sh [pnpm]
pnpm add -D @cloudflare/workers-types
```

```sh [bun]
bun add --dev @cloudflare/workers-types
```

:::

## 测试

对于测试，我们推荐使用 `jest-environment-miniflare`。
有关设置的参考，请查看 [examples](https://github.com/honojs/examples)。

如果有如下应用程序。

```ts
import { Hono } from 'hono'

const app = new Hono()
app.get('/', (c) => c.text('Please test me!'))
```

我们可以使用以下代码测试它是否返回 "_200 OK_" 响应。

```ts
describe('Test the application', () => {
  it('Should return 200 response', async () => {
    const res = await app.request('http://localhost/')
    expect(res.status).toBe(200)
  })
})
```

## 绑定

在 Cloudflare Workers 中，我们可以绑定环境值、KV 命名空间、R2 存储桶或 Durable Object。您可以在 `c.env` 中访问它们。如果您将 "_type struct_" 传递给 `Hono` 作为泛型，它将具有类型。

```ts
type Bindings = {
  MY_BUCKET: R2Bucket
  USERNAME: string
  PASSWORD: string
}

const app = new Hono<{ Bindings: Bindings }>()

// 访问环境值
app.put('/upload/:key', async (c, next) => {
  const key = c.req.param('key')
  await c.env.MY_BUCKET.put(key, c.req.body)
  return c.text(`Put ${key} successfully!`)
})
```

## 在中间件中使用变量

这是模块工作模式的唯一情况。
如果您想在中间件中使用变量或秘密变量，例如在基本身份验证中使用的“username”或“password”，您需要像下面这样编写。

```ts
import { basicAuth } from 'hono/basic-auth'

type Bindings = {
  USERNAME: string
  PASSWORD: string
}

const app = new Hono<{ Bindings: Bindings }>()

//...

app.use('/auth/*', async (c, next) => {
  const auth = basicAuth({
    username: c.env.USERNAME,
    password: c.env.PASSWORD,
  })
  return auth(c, next)
})
```

同样适用于 Bearer 身份验证中间件、JWT 身份验证或其他中间件。

## 从 Github Action 部署

在通过 CI 将代码部署到 Cloudflare 之前，您需要一个 Cloudflare 令牌。您可以从这里管理： https://dash.cloudflare.com/profile/api-tokens

如果这是一个新创建的令牌，请选择 **Edit Cloudflare Workers** 模板，如果您已经有其他令牌，请确保该令牌具有相应的权限（不，令牌权限在 Cloudflare 页面和 Cloudflare Worker 之间不共享）。

然后转到您的 Github 仓库设置仪表板： `Settings->Secrets and variables->Actions->Repository secrets`，并添加一个名为 `CLOUDFLARE_API_TOKEN` 的新秘密。

然后在您的 hono 项目根文件夹中创建 `.github/workflows/deploy.yml`，并粘贴以下代码：

```yml
name: Deploy

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    name: Deploy
    steps:
      - uses: actions/checkout@v4
      - name: Deploy
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

然后编辑 `wrangler.toml`，并在 `compatibility_date` 行后添加以下代码。

```toml
main = "src/index.ts"
minify = true
```

一切准备就绪！现在推送代码并享受吧。

## 本地开发时加载环境变量

要为本地开发配置环境变量，请在项目的根目录中创建 `.dev.vars` 文件。  
然后像使用普通 env 文件一样配置您的环境变量。

```
SECRET_KEY=value
API_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
```

> 有关此部分的更多信息，请参见 Cloudflare 文档：  
> https://developers.cloudflare.com/workers/wrangler/configuration/#secrets

然后我们使用 `c.env.*` 在代码中获取环境变量。  
**对于 Cloudflare Workers，环境变量必须通过 `c` 获取，而不是通过 `process.env`。**

```ts
type Bindings = {
  SECRET_KEY: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/env', (c) => {
  const SECRET_KEY = c.env.SECRET_KEY
  return c.text(SECRET_KEY)
})
```

在将项目部署到 Cloudflare 之前，请记得在 Cloudflare Worker 项目的配置中设置环境变量/秘密。

> 有关此部分的更多信息，请参见 Cloudflare 文档：  
> https://developers.cloudflare.com/workers/configuration/environment-variables/#add-environment-variables-via-the-dashboard