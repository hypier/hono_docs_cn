# Bun

[Bun](https://bun.sh) is another JavaScript runtime. It is not Node.js or Deno. Bun includes a transpiler, allowing us to write code using TypeScript. Hono can also run on Bun.

## 1. 安装 Bun

要安装 `bun` 命令，请按照 [官方网站](https://bun.sh) 中的说明进行操作。

## 2. 设置

### 2.1. 设置新项目

Bun 提供了一个启动器。使用 "bun create" 命令开始你的项目。 
选择 `bun` 模板作为本例的示例。

```sh
bun create hono my-app
```

进入 my-app 并安装依赖。

```sh
cd my-app
bun install
```

### 2.2. 设置现有项目

在现有的 Bun 项目中，我们只需通过以下命令在项目根目录安装 `hono` 依赖：

```sh
bun add hono
```

## 3. Hello World

"Hello World" 脚本如下。几乎与在其他平台上编写的相同。

```ts
import { Hono } from 'hono'

const app = new Hono()
app.get('/', (c) => c.text('Hello Bun!'))

export default app
```

## 4. 运行

运行命令。

```sh
bun run dev
```

然后，在浏览器中访问 `http://localhost:3000`。

## 更改端口号

您可以通过导出 `port` 来指定端口号。

<!-- prettier-ignore -->
```ts
import { Hono } from 'hono'

const app = new Hono()
app.get('/', (c) => c.text('Hello Bun!'))

export default app // [!code --]
export default { // [!code ++]
  port: 3000, // [!code ++]
  fetch: app.fetch, // [!code ++]
} // [!code ++]
```

## 提供静态文件

要提供静态文件，请使用从 `hono/bun` 导入的 `serveStatic`。

```ts
import { serveStatic } from 'hono/bun'

const app = new Hono()

app.use('/static/*', serveStatic({ root: './' }))
app.use('/favicon.ico', serveStatic({ path: './favicon.ico' }))
app.get('/', (c) => c.text('You can access: /static/hello.txt'))
app.get('*', serveStatic({ path: './static/fallback.txt' }))
```

对于上述代码，它将在以下目录结构中正常工作。

```
./
├── favicon.ico
├── src
└── static
    ├── demo
    │   └── index.html
    ├── fallback.txt
    ├── hello.txt
    └── images
        └── dinotocat.png
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

## 测试

您可以使用 `bun:test` 在 Bun 中进行测试。

```ts
import { describe, expect, it } from 'bun:test'
import app from '.'

describe('My first test', () => {
  it('Should return 200 Response', async () => {
    const req = new Request('http://localhost/')
    const res = await app.fetch(req)
    expect(res.status).toBe(200)
  })
})
```

然后，运行命令。

```sh
bun test index.test.ts
```