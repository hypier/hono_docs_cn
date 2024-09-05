# 上下文

要处理请求和响应，可以使用 `Context` 对象。

## req

`req` 是 HonoRequest 的实例。

```ts
app.get('/hello', (c) => {
  const userAgent = c.req.header('User-Agent')
  ...
})
```

## body()

返回 HTTP 响应。

您可以使用 `c.header()` 设置头部，并使用 `c.status` 设置 HTTP 状态码。这也可以在 `c.text()`、`c.json()` 等中设置。

::: info
**注意**：返回文本或 HTML 时，建议使用 `c.text()` 或 `c.html()`。
:::

```ts
app.get('/welcome', (c) => {
  // Set headers
  c.header('X-Message', 'Hello!')
  c.header('Content-Type', 'text/plain')

  // Set HTTP status code
  c.status(201)

  // Return the response body
  return c.body('Thank you for coming')
})
```

您也可以写如下代码。

```ts
app.get('/welcome', (c) => {
  return c.body('Thank you for coming', 201, {
    'X-Message': 'Hello!',
    'Content-Type': 'text/plain',
  })
})
```

响应与以下内容相同。

```ts
new Response('Thank you for coming', {
  status: 201,
  headers: {
    'X-Message': 'Hello!',
    'Content-Type': 'text/plain',
  },
})
```

## text()

将文本呈现为 `Content-Type:text/plain`。

```ts
app.get('/say', (c) => {
  return c.text('Hello!')
})
```

## json()

将 JSON 渲染为 `Content-Type:application/json`。

```ts
app.get('/api', (c) => {
  return c.json({ message: 'Hello!' })
})
```

## html()

将 HTML 渲染为 `Content-Type:text/html`。

```ts
app.get('/', (c) => {
  return c.html('<h1>Hello! Hono!</h1>')
})
```

## notFound()

返回 `Not Found` 响应。

```ts
app.get('/notfound', (c) => {
  return c.notFound()
})
```

## redirect()

重定向，默认状态码为 `302`。

```ts
app.get('/redirect', (c) => {
  return c.redirect('/')
})
app.get('/redirect-permanently', (c) => {
  return c.redirect('/', 301)
})
```

## res

```ts
// Response object
app.use('/', async (c, next) => {
  await next()
  c.res.headers.append('X-Debug', 'Debug message')
})
```

## set() / get()

获取和设置任意键值对，生命周期为当前请求。这允许在中间件之间或从中间件到路由处理程序之间传递特定值。

```ts
app.use(async (c, next) => {
  c.set('message', 'Hono is cool!!')
  await next()
})

app.get('/', (c) => {
  const message = c.get('message')
  return c.text(`The message is "${message}"`)
})
```

将 `Variables` 作为泛型传递给 `Hono` 的构造函数，以实现类型安全。

```ts
type Variables = {
  message: string
}

const app = new Hono<{ Variables: Variables }>()
```

`c.set` / `c.get` 的值仅在同一请求内保留。它们无法在不同请求之间共享或持久化。

## var

您也可以通过 `c.var` 访问变量的值。

```ts
const result = c.var.client.oneMethod()
```

如果您想创建一个提供自定义方法的中间件，可以如下编写：

```ts
type Env = {
  Variables: {
    echo: (str: string) => string
  }
}

const app = new Hono()

const echoMiddleware = createMiddleware<Env>(async (c, next) => {
  c.set('echo', (str) => str)
  await next()
})

app.get('/echo', echoMiddleware, (c) => {
  return c.text(c.var.echo('Hello!'))
})
```

如果您想在多个处理程序中使用该中间件，可以使用 `app.use()`。然后，您必须将 `Env` 作为泛型传递给 `Hono` 的构造函数，以确保类型安全。

```ts
const app = new Hono<Env>()

app.use(echoMiddleware)

app.get('/echo', (c) => {
  return c.text(c.var.echo('Hello!'))
})
```

## render() / setRenderer()

您可以在自定义中间件中使用 `c.setRenderer()` 设置布局。

```tsx
app.use(async (c, next) => {
  c.setRenderer((content) => {
    return c.html(
      <html>
        <body>
          <p>{content}</p>
        </body>
      </html>
    )
  })
  await next()
})
```

然后，您可以利用 `c.render()` 在此布局中创建响应。

```ts
app.get('/', (c) => {
  return c.render('Hello!')
})
```

其输出将是：

```html
<html>
  <body>
    <p>Hello!</p>
  </body>
</html>
```

此外，此功能提供了自定义参数的灵活性。
为了确保类型安全，可以定义类型如下：

```ts
declare module 'hono' {
  interface ContextRenderer {
    (
      content: string | Promise<string>,
      head: { title: string }
    ): Response | Promise<Response>
  }
}
```

以下是您可以如何使用此功能的示例：

```ts
app.use('/pages/*', async (c, next) => {
  c.setRenderer((content, head) => {
    return c.html(
      <html>
        <head>
          <title>{head.title}</title>
        </head>
        <body>
          <header>{head.title}</header>
          <p>{content}</p>
        </body>
      </html>
    )
  })
  await next()
})

app.get('/pages/my-favorite', (c) => {
  return c.render(<p>Ramen and Sushi</p>, {
    title: 'My favorite',
  })
})

app.get('/pages/my-hobbies', (c) => {
  return c.render(<p>Watching baseball</p>, {
    title: 'My hobbies',
  })
})
```

## executionCtx

```ts
// ExecutionContext object
app.get('/foo', async (c) => {
  c.executionCtx.waitUntil(
    c.env.KV.put(key, data)
  )
  ...
})
```

## 事件

```ts
// Type definition to make type inference
type Bindings = {
  MY_KV: KVNamespace
}

const app = new Hono<{ Bindings: Bindings }>()


// FetchEvent object (only set when using Service Worker syntax)
app.get('/foo', async (c) => {
  c.event.waitUntil(
    c.env.MY_KV.put(key, data)
  )
  ...
})
```

## env

在 Cloudflare Workers 中，环境变量、密钥、KV 命名空间、D1 数据库、R2 存储桶等与工作者绑定的内容被称为绑定。无论类型如何，绑定始终作为全局变量可用，可以通过上下文 `c.env.BINDING_KEY` 访问。

```ts
// Type definition to make type inference
type Bindings = {
  MY_KV: KVNamespace
}

const app = new Hono<{ Bindings: Bindings }>()

// Environment object for Cloudflare Workers
app.get('/', (c) => {
  c.env.MY_KV.get('my-key')
  // ...
})
```

## 错误

如果 Handler 抛出错误，错误对象将放置在 `c.error` 中。您可以在中间件中访问它。

```ts
app.use(async (c, next) => {
  await next()
  if (c.error) {
    // do something...
  }
})
```

## ContextVariableMap

例如，如果您希望在使用特定中间件时为变量添加类型定义，可以扩展 `ContextVariableMap`。例如：

```ts
declare module 'hono' {
  interface ContextVariableMap {
    result: string
  }
}
```

然后您可以在中间件中使用它：

```ts
const mw = createMiddleware(async (c, next) => {
  c.set('result', 'some values') // result 是一个字符串
  await next()
})
```

在处理程序中，变量被推断为正确的类型：

```ts
app.get('/', (c) => {
  const val = c.get('result') // val 是一个字符串
  //...
})
```