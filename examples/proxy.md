# 代理

```ts
import { Hono } from 'hono'

const app = new Hono()

app.get('/posts/:filename{.+.png$}', (c) => {
  const referer = c.req.header('Referer')
  if (referer && !/^https:\/\/example.com/.test(referer)) {
    return c.text('Forbidden', 403)
  }
  return fetch(c.req.url)
})

app.get('*', (c) => {
  return fetch(c.req.url)
})

export default app
```

::: tip
如果您在类似代码中看到 `Can't modify immutable headers.` 错误，您需要克隆响应对象。

```ts
app.get('/', async (_c) => {
  const response = await fetch('https://example.com')
  // 克隆响应以返回一个可修改头部的响应
  const newResponse = new Response(response.body, response)
  return newResponse
})
```

通过 `fetch` 返回的 `Response` 的头部是不可变的。因此，如果您修改它，将会发生错误。
:::