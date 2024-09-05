# 应用 - Hono

`Hono` 是主要对象。
它将首先被导入并使用到最后。

```ts
import { Hono } from 'hono'

const app = new Hono()
//...

export default app // for Cloudflare Workers or Bun
```

## 方法

`Hono` 的实例具有以下方法。

- app.**HTTP_METHOD**(\[path,\]handler|middleware...)
- app.**all**(\[path,\]handler|middleware...)
- app.**on**(method|method[], path|path[], handler|middleware...)
- app.**use**(\[path,\]middleware)
- app.**route**(path, \[app\])
- app.**basePath**(path)
- app.**notFound**(handler)
- app.**onError**(err, handler)
- app.**mount**(path, anotherApp)
- app.**fire**()
- app.**fetch**(request, env, event)
- app.**request**(path, options)

它们的第一部分用于路由，请参考 [路由部分](/docs/api/routing)。

## 未找到

`app.notFound` 允许您自定义未找到响应。

```ts
app.notFound((c) => {
  return c.text('Custom 404 Message', 404)
})
```

## 错误处理

`app.onError` 处理错误并返回自定义响应。

```ts
app.onError((err, c) => {
  console.error(`${err}`)
  return c.text('Custom Error Message', 500)
})
```

## fire()

`app.fire()` 会自动添加一个全局的 `fetch` 事件监听器。

这对于遵循 [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) 的环境非常有用，例如 [非 ES 模块的 Cloudflare Workers](https://developers.cloudflare.com/workers/reference/migrate-to-module-workers/)。

`app.fire()` 为您执行以下操作：

```ts
addEventListener('fetch', (event: FetchEventLike): void => {
  event.respondWith(this.dispatch(...))
})
```

## fetch()

`app.fetch` 将是您的应用程序的入口点。

对于 Cloudflare Workers，您可以使用以下代码：

```ts
export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    return app.fetch(request, env, ctx)
  },
}
```

或者可以这样做：

```ts
export default app
```

Bun:

<!-- prettier-ignore -->
```ts
export default app // [!code --]
export default {  // [!code ++]
  port: 3000, // [!code ++]
  fetch: app.fetch, // [!code ++]
} // [!code ++]
```

## request()

`request` 是一个用于测试的有用方法。

您可以传递一个 URL 或路径名以发送 GET 请求。
`app` 将返回一个 `Response` 对象。

```ts
test('GET /hello is ok', async () => {
  const res = await app.request('/hello')
  expect(res.status).toBe(200)
})
```

您还可以传递一个 `Request` 对象：

```ts
test('POST /message is ok', async () => {
  const req = new Request('Hello!', {
    method: 'POST',
  })
  const res = await app.request(req)
  expect(res.status).toBe(201)
})
```

## mount()

`mount()` 允许您将使用其他框架构建的应用程序挂载到您的 Hono 应用程序中。

```ts
import { Router as IttyRouter } from 'itty-router'
import { Hono } from 'hono'

// Create itty-router application
const ittyRouter = IttyRouter()

// Handle `GET /itty-router/hello`
ittyRouter.get('/hello', () => new Response('Hello from itty-router'))

// Hono application
const app = new Hono()

// Mount!
app.mount('/itty-router', ittyRouter.handle)
```

## Strict Mode

Strict mode is enabled by default and distinguishes between the following routes.

- `/hello`
- `/hello/`

`app.get('/hello')` will not match `GET /hello/`.

By setting strict mode to `false`, both paths will be considered equal.

```ts
const app = new Hono({ strict: false })
```

## router 选项

`router` 选项指定要使用哪个路由器。默认路由器是 `SmartRouter`。如果您想使用 `RegExpRouter`，请将其传递给新的 `Hono` 实例：

```ts
import { RegExpRouter } from 'hono/router/reg-exp-router'

const app = new Hono({ router: new RegExpRouter() })
```

## 泛型

您可以传递泛型来指定在 `c.set`/`c.get` 中使用的 Cloudflare Workers 绑定和变量的类型。

```ts
type Bindings = {
  TOKEN: string
}

type Variables = {
  user: User
}

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>()

app.use('/auth/*', async (c, next) => {
  const token = c.env.TOKEN // token 是 `string`
  // ...
  c.set('user', user) // user 应该是 `User`
  await next()
})
```