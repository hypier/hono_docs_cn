# SSG Helper

SSG Helper 从您的 Hono 应用程序生成静态网站。它将检索注册路由的内容并将其保存为静态文件。

## 用法

### 手册

如果您有一个简单的 Hono 应用程序，如下所示：

```tsx
// index.tsx
const app = new Hono()

app.get('/', (c) => c.html('Hello, World!'))
app.use('/about', async (c, next) => {
  c.setRenderer((content, head) => {
    return c.html(
      <html>
        <head>
          <title>{head.title ?? ''}</title>
        </head>
        <body>
          <p>{content}</p>
        </body>
      </html>
    )
  })
  await next()
})
app.get('/about', (c) => {
  return c.render('Hello!', { title: 'Hono SSG Page' })
})

export default app
```

对于 Node.js，创建一个构建脚本，如下所示：

```ts
// build.ts
import app from './index'
import { toSSG } from 'hono/ssg'
import fs from 'fs/promises'

toSSG(app, fs)
```

执行脚本后，文件将输出如下：

```bash
ls ./static
about.html  index.html
```

### Vite 插件

使用 `@hono/vite-ssg` Vite 插件，您可以轻松处理该过程。

有关更多详细信息，请查看这里：

https://github.com/honojs/vite-plugins/tree/main/packages/ssg

## toSSG

`toSSG` 是生成静态站点的主要函数，接受一个应用程序和一个文件系统模块作为参数。它基于以下内容：

### 输入

toSSG 的参数在 ToSSGInterface 中指定。

```ts
export interface ToSSGInterface {
  (
    app: Hono,
    fsModule: FileSystemModule,
    options?: ToSSGOptions
  ): Promise<ToSSGResult>
}
```

- `app` 指定为 `new Hono()`，并注册了路由。
- `fs` 指定为以下对象，假设为 `node:fs/promise`。

```ts
export interface FileSystemModule {
  writeFile(path: string, data: string | Uint8Array): Promise<void>
  mkdir(
    path: string,
    options: { recursive: boolean }
  ): Promise<void | string>
}
```

### 在 Deno 和 Bun 中使用适配器

如果您想在 Deno 或 Bun 上使用 SSG，针对每个文件系统提供了一个 `toSSG` 函数。

对于 Deno：

```ts
import { toSSG } from 'hono/deno'

toSSG(app) // The second argument is an option typed `ToSSGOptions`.
```

对于 Bun：

```ts
import { toSSG } from 'hono/bun'

toSSG(app) // The second argument is an option typed `ToSSGOptions`.
```

### 选项

选项在 ToSSGOptions 接口中指定。

```ts
export interface ToSSGOptions {
  dir?: string
  concurrency?: number
  beforeRequestHook?: BeforeRequestHook
  afterResponseHook?: AfterResponseHook
  afterGenerateHook?: AfterGenerateHook
  extensionMap?: Record<string, string>
}
```

- `dir` 是静态文件的输出目录。默认值为 `./static`。
- `concurrency` 是同时生成的文件的并发数。默认值为 `2`。
- `extensionMap` 是一个映射，包含 `Content-Type` 作为键，扩展名的字符串作为值。用于确定输出文件的文件扩展名。

每个 Hook 会在后面描述。

### 输出

`toSSG` 返回以下结果类型的结果。

```ts
export interface ToSSGResult {
  success: boolean
  files: string[]
  error?: Error
}
```

## Hook

您可以通过在选项中指定以下自定义钩子来定制 `toSSG` 的过程。

```ts
export type BeforeRequestHook = (req: Request) => Request | false
export type AfterResponseHook = (res: Response) => Response | false
export type AfterGenerateHook = (
  result: ToSSGResult
) => void | Promise<void>
```

### BeforeRequestHook/AfterResponseHook

`toSSG` 目标是应用中注册的所有路由，但如果有要排除的路由，可以通过指定 Hook 进行过滤。

例如，如果您只想输出 GET 请求，可以在 `beforeRequestHook` 中过滤 `req.method`。

```ts
toSSG(app, fs, {
  beforeRequestHook: (req) => {
    if (req.method === 'GET') {
      return req
    }
    return false
  },
})
```

例如，如果您只想在状态码为 200 或 500 时输出，可以在 `afterResponseHook` 中过滤 `res.status`。

```ts
toSSG(app, fs, {
  afterResponseHook: (res) => {
    if (res.status === 200 || res.status === 500) {
      return res
    }
    return false
  },
})
```

### AfterGenerateHook

使用 `afterGenerateHook` 如果您想要挂钩 `toSSG` 的结果。

```ts
toSSG(app, fs, {
  afterGenerateHook: (result) => {
    if (result.files) {
      result.files.forEach((file) => console.log(file))
    }
  })
})
```

## 生成文件

### 路由和文件名

以下规则适用于注册的路由信息和生成的文件名。默认的 `./static` 的行为如下：

- `/` -> `./static/index.html`
- `/path` -> `./static/path.html`
- `/path/` -> `./static/path/index.html`

### 文件扩展名

文件扩展名取决于每个路由返回的 `Content-Type`。例如，来自 `c.html` 的响应保存为 `.html`。

如果您想自定义文件扩展名，请设置 `extensionMap` 选项。

```ts
import { toSSG, defaultExtensionMap } from 'hono/ssg'

// Save `application/x-html` content with `.html`
toSSG(app, fs, {
  extensionMap: {
    'application/x-html': 'html',
    ...defaultExtensionMap,
  },
})
```

请注意，以斜杠结尾的路径将保存为 index.ext，而不管扩展名是什么。

```ts
// save to ./static/html/index.html
app.get('/html/', (c) => c.html('html'))

// save to ./static/text/index.txt
app.get('/text/', (c) => c.text('text'))
```

## 中间件

引入支持 SSG 的内置中间件。

### ssgParams

您可以使用类似于 Next.js 的 `generateStaticParams` 的 API。

示例：

```ts
app.get(
  '/shops/:id',
  ssgParams(async () => {
    const shops = await getShops()
    return shops.map((shop) => ({ id: shop.id }))
  }),
  async (c) => {
    const shop = await getShop(c.req.param('id'))
    if (!shop) {
      return c.notFound()
    }
    return c.render(
      <div>
        <h1>{shop.name}</h1>
      </div>
    )
  }
)
```

### disableSSG

设置了 `disableSSG` 中间件的路由将被 `toSSG` 排除在静态文件生成之外。

```ts
app.get('/api', disableSSG(), (c) => c.text('an-api'))
```

### onlySSG

设置了 `onlySSG` 中间件的路由将在执行 `toSSG` 后被 `c.notFound()` 覆盖。

```ts
app.get('/static-page', onlySSG(), (c) => c.html(<h1>Welcome to my site</h1>))
```