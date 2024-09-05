# CORS 中间件

Cloudflare Workers 作为 Web API 的使用场景有很多，并且可以从外部前端应用程序调用它们。为了实现这一点，我们需要实现 CORS，让我们也通过中间件来完成这个任务。 

```javascript
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const response = await fetch(request)
  const modifiedResponse = new Response(response.body, response)
  modifiedResponse.headers.set('Access-Control-Allow-Origin', '*')
  return modifiedResponse
}
```

## 导入

```ts
import { Hono } from 'hono'
import { cors } from 'hono/cors'
```

## 用法

```ts
const app = new Hono()

app.use('/api/*', cors())
app.use(
  '/api2/*',
  cors({
    origin: 'http://example.com',
    allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
    maxAge: 600,
    credentials: true,
  })
)

app.all('/api/abc', (c) => {
  return c.json({ success: true })
})
app.all('/api2/abc', (c) => {
  return c.json({ success: true })
})
```

多个来源：

```ts
app.use(
  '/api3/*',
  cors({
    origin: ['https://example.com', 'https://example.org'],
  })
)

// 或者你可以使用 "function"
app.use(
  '/api4/*',
  cors({
    // `c` 是一个 `Context` 对象
    origin: (origin, c) => {
      return origin.endsWith('.example.com')
        ? origin
        : 'http://example.com'
    },
  })
)
```

## Options

### <Badge type="info" text="可选" /> origin: `string` | `string[]` | `(origin:string, c:Context) => string`

"_Access-Control-Allow-Origin_" CORS头的值。您还可以传递回调函数，例如 `origin: (origin) => (origin.endsWith('.example.com') ? origin : 'http://example.com')`。默认值为 `*`。

### <Badge type="info" text="optional" /> allowMethods: `string[]`

"_Access-Control-Allow-Methods_" CORS 头的值。默认值为 `['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH']`。

### <Badge type="info" text="可选" /> allowHeaders: `string[]`

"_Access-Control-Allow-Headers_" CORS 头的值。默认值为 `[]`。

### <Badge type="info" text="可选" /> maxAge: `number`

"_Access-Control-Max-Age_" CORS 响应头的值。

### <Badge type="info" text="可选" /> credentials: `boolean`

"_Access-Control-Allow-Credentials_" CORS 响应头的值。

### <Badge type="info" text="可选" /> exposeHeaders: `string[]`

"_Access-Control-Expose-Headers_" CORS 头的值。默认值为 `[]`。

## 环境依赖的 CORS 配置

如果您想根据执行环境（例如开发或生产）调整 CORS 配置，从环境变量中注入值是方便的，因为这消除了应用程序需要了解其自身执行环境的必要性。请参见下面的示例以作说明。

```ts
app.use('*', async (c, next) => {
  const corsMiddlewareHandler = cors({
    origin: c.env.CORS_ORIGIN,
  })
  return corsMiddlewareHandler(c, next)
})
```