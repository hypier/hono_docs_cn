# Deno

[Deno](https://deno.com/) 是一个基于 V8 的 JavaScript 运行时。它不是 Node.js。  
Hono 也可以在 Deno 上运行。

您可以使用 Hono，使用 TypeScript 编写代码，使用 `deno` 命令运行应用程序，并将其部署到 "Deno Deploy"。

## 1. 安装 Deno

首先，安装 `deno` 命令。
请参考 [官方文档](https://docs.deno.com/runtime/manual/getting_started/installation)。

## 2. 设置

可以使用 Deno 的启动器。
使用 "create-hono" 命令开始您的项目。

```sh
deno run -A npm:create-hono my-app
```

为此示例选择 `deno` 模板。

进入 `my-app`。对于 Deno，您不需要显式安装 Hono。

```sh
cd my-app
```

## 3. 你好，世界

编写您的第一个应用程序。

```ts
import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => c.text('Hello Deno!'))

Deno.serve(app.fetch)
```

## 4. 运行

只需执行以下命令：

```sh
deno task start
```

## 更改端口号

您可以通过更新 `main.ts` 中 `Deno.serve` 的参数来指定端口号：

```ts
Deno.serve(app.fetch) // [!code --]
Deno.serve({ port: 8787 }, app.fetch) // [!code ++]
```

## 提供静态文件

要提供静态文件，请使用从 `hono/middleware.ts` 导入的 `serveStatic`。

```ts
import { Hono } from 'hono'
import { serveStatic } from 'hono/deno'

const app = new Hono()

app.use('/static/*', serveStatic({ root: './' }))
app.use('/favicon.ico', serveStatic({ path: './favicon.ico' }))
app.get('/', (c) => c.text('You can access: /static/hello.txt'))
app.get('*', serveStatic({ path: './static/fallback.txt' }))

Deno.serve(app.fetch)
```

对于上述代码，它将在以下目录结构中正常工作。

```
./
├── favicon.ico
├── index.ts
└── static
    ├── demo
    │   └── index.html
    ├── fallback.txt
    ├── hello.txt
    └── images
        └── dinotocat.png
```

### `rewriteRequestPath`

如果您想将 `http://localhost:8000/static/*` 映射到 `./statics`，可以使用 `rewriteRequestPath` 选项：

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

## Deno Deploy

Deno Deploy 是一个用于 Deno 的边缘运行时平台。  
我们可以在 Deno Deploy 上将应用程序发布到全球。

Hono 也支持 Deno Deploy。请参考 [官方文档](https://docs.deno.com/deploy/manual/)。

## 测试

在 Deno 上测试应用程序很简单。  
您可以使用 `Deno.test` 并从 [@std/assert](https://jsr.io/@std/assert) 中使用 `assert` 或 `assertEquals`。

```sh
deno add @std/assert
```

```ts
import { Hono } from 'hono'
import { assertEquals } from '@std/assert'

Deno.test('Hello World', async () => {
  const app = new Hono()
  app.get('/', (c) => c.text('Please test me'))

  const res = await app.request('http://localhost/')
  assertEquals(res.status, 200)
})
```

然后运行命令：

```sh
deno test hello.ts
```

## `npm:` 说明符

`npm:hono` 也可用。您可以通过固定 `deno.json` 来使用它：

```json
{
  "imports": {
    "hono": "jsr:@hono/hono" // [!code --]
    "hono": "npm:hono" // [!code ++]
  }
}
```

您可以使用 `npm:hono` 或 `jsr:@hono/hono`。

如果您想使用第三方中间件，例如 `npm:@hono/zod-validator`，并希望获得 TypeScript 类型推断，您需要使用 `npm:` 说明符。

```json
{
  "imports": {
    "hono": "npm:hono",
    "zod": "npm:zod",
    "@hono/zod-validator": "npm:@hono/zod-validator"
  }
}
```