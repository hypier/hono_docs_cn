# Node.js

[Node.js](https://nodejs.org/) 是一个开源的跨平台 JavaScript 运行时环境。

Hono 起初并不是为 Node.js 设计的。但通过 [Node.js 适配器](https://github.com/honojs/node-server)，它也可以在 Node.js 上运行。

::: info
它适用于版本大于 18.x 的 Node.js。具体所需的 Node.js 版本如下：

- 18.x => 18.14.1+
- 19.x => 19.7.0+
- 20.x => 20.0.0+

基本上，您可以简单地使用每个主要版本的最新版本。
:::

## 1. 设置

可以使用 Node.js 的启动器。
使用 "create-hono" 命令启动您的项目。
选择此示例的 `nodejs` 模板。

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

编辑 `src/index.ts`:

```ts
import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()
app.get('/', (c) => c.text('Hello Node.js!'))

serve(app)
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

:::

## 更改端口号

您可以使用 `port` 选项指定端口号。

```ts
serve({
  fetch: app.fetch,
  port: 8787,
})
```

## 访问原生 Node.js API

您可以从 `c.env.incoming` 和 `c.env.outgoing` 访问 Node.js API。

```ts
import { Hono } from 'hono'
import { serve, type HttpBindings } from '@hono/node-server'
// or `Http2Bindings` if you use HTTP2

type Bindings = HttpBindings & {
  /* ... */
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/', (c) => {
  return c.json({
    remoteAddress: c.env.incoming.socket.remoteAddress,
  })
})

serve(app)
```

## 提供静态文件

您可以使用 `serveStatic` 从本地文件系统提供静态文件。

```ts
import { serveStatic } from '@hono/node-server/serve-static'

app.use('/static/*', serveStatic({ root: './' }))
```

### `rewriteRequestPath`

如果您想将 `http://localhost:3000/static/*` 映射到 `./statics`，可以使用 `rewriteRequestPath` 选项：

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

## http2

您可以在 [Node.js http2 服务器](https://nodejs.org/api/http2.html) 上运行 hono。

### 未加密的 http2

```ts
import { createServer } from 'node:http2'

const server = serve({
  fetch: app.fetch,
  createServer,
})
```

### 加密的 http2

```ts
import { createSecureServer } from 'node:http2'
import { readFileSync } from 'node:fs'

const server = serve({
  fetch: app.fetch,
  createServer: createSecureServer,
  serverOptions: {
    key: readFileSync('localhost-privkey.pem'),
    cert: readFileSync('localhost-cert.pem'),
  },
})
```

## Dockerfile

这是一个 Dockerfile 的示例。

```Dockerfile
FROM node:20-alpine AS base

FROM base AS builder

RUN apk add --no-cache gcompat
WORKDIR /app

COPY package*json tsconfig.json src ./

RUN npm ci && \
    npm run build && \
    npm prune --production

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

COPY --from=builder --chown=hono:nodejs /app/node_modules /app/node_modules
COPY --from=builder --chown=hono:nodejs /app/dist /app/dist
COPY --from=builder --chown=hono:nodejs /app/package.json /app/package.json

USER hono
EXPOSE 3000

CMD ["node", "/app/dist/index.js"]
```

以下步骤应提前完成。

1. 在 `tsconfig.json` 的 `compilerOptions` 部分添加 `"outDir": "./dist"`。
2. 在 `tsconfig.json` 中添加 `"exclude": ["node_modules"]`。
3. 在 `package.json` 的 `script` 部分添加 `"build": "tsc"`。
4. 运行 `npm install typescript --save-dev`。
5. 在 `package.json` 中添加 `"type": "module"`。