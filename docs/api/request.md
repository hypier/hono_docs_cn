# HonoRequest

`HonoRequest` 是一个可以从 `c.req` 中获取的对象，它封装了一个 [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) 对象。

## param()

获取路径参数的值。

```ts
// Captured params
app.get('/entry/:id', (c) => {
  const id = c.req.param('id')
  ...
})

// Get all params at once
app.get('/entry/:id/comment/:commentId', (c) => {
  const { id, commentId } = c.req.param()
})
```

## query()

获取查询字符串参数。

```ts
// Query params
app.get('/search', (c) => {
  const query = c.req.query('q')
  ...
})

// Get all params at once
app.get('/search', (c) => {
  const { q, limit, offset } = c.req.query()
  ...
})
```

## queries()

获取多个查询字符串参数值，例如 `/search?tags=A&tags=B`

```ts
app.get('/search', (c) => {
  // tags 将是 string[]
  const tags = c.req.queries('tags')
  ...
})
```

## header()

获取请求头的值。

```ts
app.get('/', (c) => {
  const userAgent = c.req.header('User-Agent')
  ...
})
```

## parseBody()

解析类型为 `multipart/form-data` 或 `application/x-www-form-urlencoded` 的请求体

```ts
app.post('/entry', async (c) => {
  const body = await c.req.parseBody()
  ...
})
```

`parseBody()` 支持以下行为。

**单个文件**

```ts
const body = await c.req.parseBody()
body['foo']
```

`body['foo']` 是 `(string | File)`。

如果上传了多个文件，将使用最后一个文件。

### 多个文件

```ts
const body = await c.req.parseBody()
body['foo[]']
```

`body['foo[]']` 始终是 `(string | File)[]`。

`[]` 后缀是必需的。

### 同名多个文件

```ts
const body = await c.req.parseBody({ all: true })
body['foo']
```

`all` 选项默认是禁用的。

- 如果 `body['foo']` 是多个文件，它将被解析为 `(string | File)[]`。
- 如果 `body['foo']` 是单个文件，它将被解析为 `(string | File)`。

### 点表示法

如果将 `dot` 选项设置为 `true`，返回值将基于点表示法进行结构化。

想象一下接收到以下数据：

```ts
const data = new FormData()
data.append('obj.key1', 'value1')
data.append('obj.key2', 'value2')
```

通过将 `dot` 选项设置为 `true`，您可以获取结构化的值：

```ts
const body = await c.req.parseBody({ dot: true })
// body is `{ obj: { key1: 'value1', key2: 'value2' } }`
```

## json()

解析类型为 `application/json` 的请求体

```ts
app.post('/entry', async (c) => {
  const body = await c.req.json()
  ...
})
```

## text()

解析类型为 `text/plain` 的请求主体

```ts
app.post('/entry', async (c) => {
  const body = await c.req.text()
  ...
})
```

## arrayBuffer()

将请求体解析为 `ArrayBuffer`

```ts
app.post('/entry', async (c) => {
  const body = await c.req.arrayBuffer()
  ...
})
```

## blob()

将请求体解析为 `Blob`。

```ts
app.post('/entry', async (c) => {
  const body = await c.req.blob()
  ...
})
```

## formData()

将请求体解析为 `FormData`。

```ts
app.post('/entry', async (c) => {
  const body = await c.req.formData()
  ...
})
```

## valid()

获取验证过的数据。

```ts
app.post('/posts', (c) => {
  const { title, body } = c.req.valid('form')
  ...
})
```

可用的目标如下。

- `form`
- `json`
- `query`
- `header`
- `cookie`
- `param`

请参阅[验证部分](/docs/guides/validation)以获取使用示例。

## routePath()

您可以通过以下方式在处理程序中检索注册的路径：

```ts
app.get('/posts/:id', (c) => {
  return c.json({ path: c.req.routePath })
})
```

如果您访问 `/posts/123`，它将返回 `/posts/:id`：

```json
{ "path": "/posts/:id" }
```

## matchedRoutes()

它返回处理程序内的匹配路由，这对于调试非常有用。

```ts
app.use(async function logger(c, next) {
  await next()
  c.req.matchedRoutes.forEach(({ handler, method, path }, i) => {
    const name =
      handler.name ||
      (handler.length < 2 ? '[handler]' : '[middleware]')
    console.log(
      method,
      ' ',
      path,
      ' '.repeat(Math.max(10 - path.length, 0)),
      name,
      i === c.req.routeIndex ? '<- respond from here' : ''
    )
  })
})
```

## 路径

请求的路径名。

```ts
app.get('/about/me', (c) => {
  const pathname = c.req.path // `/about/me`
  ...
})
```

## url

请求的 url 字符串。

```ts
app.get('/about/me', (c) => {
  const url = c.req.url // `http://localhost:8787/about/me`
  ...
})
```

## 方法

请求的方法名称。

```ts
app.get('/about/me', (c) => {
  const method = c.req.method // `GET`
  ...
})
```

## 原始

原始 [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) 对象。

```ts
// For Cloudflare Workers
app.post('/', async (c) => {
  const metadata = c.req.raw.cf?.hostMetadata?
  ...
})
```