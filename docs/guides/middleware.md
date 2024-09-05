# 中间件

中间件在处理程序之前或之后工作。我们可以在分发之前获取 `Request`，或在分发之后操作 `Response`。

## 中间件的定义

- Handler - 应返回 `Response` 对象。只会调用一个处理器。
- Middleware - 应不返回任何内容，将通过 `await next()` 继续处理下一个中间件。

用户可以使用 `app.use` 或 `app.HTTP_METHOD` 注册中间件以及处理器。对于此功能，指定路径和方法非常简单。

```ts
// match any method, all routes
app.use(logger())

// specify path
app.use('/posts/*', cors())

// specify method and path
app.post('/posts/*', basicAuth())
```

如果处理器返回 `Response`，它将用于最终用户，并停止处理。

```ts
app.post('/posts', (c) => c.text('Created!', 201))
```

在这种情况下，在分发之前将处理四个中间件，如下所示：

```ts
logger() -> cors() -> basicAuth() -> *handler*
```

## 执行顺序

Middleware 的执行顺序由其注册的顺序决定。第一个注册的 Middleware 的 `next` 之前的过程先执行，`next` 之后的过程最后执行。请看下面的示例。

```ts
app.use(async (_, next) => {
  console.log('middleware 1 start')
  await next()
  console.log('middleware 1 end')
})
app.use(async (_, next) => {
  console.log('middleware 2 start')
  await next()
  console.log('middleware 2 end')
})
app.use(async (_, next) => {
  console.log('middleware 3 start')
  await next()
  console.log('middleware 3 end')
})

app.get('/', (c) => {
  console.log('handler')
  return c.text('Hello!')
})
```

结果如下。

```
middleware 1 start
  middleware 2 start
    middleware 3 start
      handler
    middleware 3 end
  middleware 2 end
middleware 1 end
```

## 内置中间件

Hono 具有内置中间件。

```ts
import { Hono } from 'hono'
import { poweredBy } from 'hono/powered-by'
import { logger } from 'hono/logger'
import { basicAuth } from 'hono/basic-auth'

const app = new Hono()

app.use(poweredBy())
app.use(logger())

app.use(
  '/auth/*',
  basicAuth({
    username: 'hono',
    password: 'acoolproject',
  })
)
```

::: warning
在 Deno 中，可以使用与 Hono 版本不同的中间件版本，但这可能导致错误。
例如，以下代码无法正常工作，因为版本不同。

```ts
import { Hono } from 'jsr:@hono/hono@4.4.0'
import { upgradeWebSocket } from 'jsr:@hono/hono@4.4.5/deno'

const app = new Hono()

app.get(
  '/ws',
  upgradeWebSocket(() => ({
    // ...
  }))
)
```

:::

## 自定义中间件

您可以直接在 `app.use()` 中编写自己的中间件：

```ts
// 自定义日志记录器
app.use(async (c, next) => {
  console.log(`[${c.req.method}] ${c.req.url}`)
  await next()
})

// 添加自定义头部
app.use('/message/*', async (c, next) => {
  await next()
  c.header('x-message', '这是中间件!')
})

app.get('/message/hello', (c) => c.text('你好，中间件!'))
```

然而，直接在 `app.use()` 中嵌入中间件可能会限制其可重用性。因此，我们可以将中间件分离到不同的文件中。

为了确保在分离中间件时不会丢失 `context` 和 `next` 的类型定义，我们可以使用 Hono 的工厂中的 [`createMiddleware()`](/docs/helpers/factory#createmiddleware)。

```ts
import { createMiddleware } from 'hono/factory'

const logger = createMiddleware(async (c, next) => {
  console.log(`[${c.req.method}] ${c.req.url}`)
  await next()
})
```

:::info
类型泛型可以与 `createMiddleware` 一起使用：

```ts
createMiddleware<{Bindings: Bindings}>(async (c, next) =>
```

:::

### 修改下一个响应

此外，中间件可以设计为在必要时修改响应：

```ts
const stripRes = createMiddleware(async (c, next) => {
  await next()
  c.res = undefined
  c.res = new Response('New Response')
})
```

## 在中间件参数中访问上下文

要在中间件参数中访问上下文，直接使用 `app.use` 提供的上下文参数。请参见下面的示例以获得澄清。

```ts
import { cors } from 'hono/cors'

app.use('*', async (c, next) => {
  const middleware = cors({
    origin: c.env.CORS_ORIGIN,
  })
  return middleware(c, next)
})
```

### 在中间件中扩展上下文

要在中间件内部扩展上下文，请使用 `c.set`。您可以通过将 `{ Variables: { yourVariable: YourVariableType } }` 泛型参数传递给 `createMiddleware` 函数来实现类型安全。

```ts
import { createMiddleware } from 'hono/factory'

const echoMiddleware = createMiddleware<{
  Variables: {
    echo: (str: string) => string
  }
}>(async (c, next) => {
  c.set('echo', (str) => str)
  await next()
})

app.get('/echo', echoMiddleware, (c) => {
  return c.text(c.var.echo('Hello!'))
})
```

## 第三方中间件

内置中间件不依赖于外部模块，但第三方中间件可以依赖于第三方库。
因此，使用它们，我们可以构建更复杂的应用程序。

例如，我们有 GraphQL Server Middleware、Sentry Middleware、Firebase Auth Middleware 等。