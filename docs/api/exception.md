# Exception

当发生致命错误(例如身份验证失败)时，必须引发HTTPException。

## 抛出 HTTPException

此示例从中间件抛出一个 HTTPException。

```ts
import { HTTPException } from 'hono/http-exception'

// ...

app.post('/auth', async (c, next) => {
  // 认证
  if (authorized === false) {
    throw new HTTPException(401, { message: 'Custom error message' })
  }
  await next()
})
```

您可以指定返回给用户的响应。

```ts
const errorResponse = new Response('Unauthorized', {
  status: 401,
  headers: {
    Authenticate: 'error="invalid_token"',
  },
})
throw new HTTPException(401, { res: errorResponse })
```

## 处理 HTTPException

您可以使用 `app.onError` 处理抛出的 HTTPException。

```ts
import { HTTPException } from 'hono/http-exception'

// ...

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    // 获取自定义响应
    return err.getResponse()
  }
  //...
})
```

## `cause`

`cause` 选项可用于添加 [`cause`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause) 数据。

```ts
app.post('/auth', async (c, next) => {
  try {
    authorize(c)
  } catch (e) {
    throw new HTTPException(401, { message, cause: e })
  }
  await next()
})
```