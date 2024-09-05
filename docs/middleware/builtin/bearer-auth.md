# Bearer Auth Middleware

Bearer Auth Middleware 提供通过验证请求头中的 API 令牌进行身份验证。访问该端点的 HTTP 客户端将添加 `Authorization` 头，值为 `Bearer {token}`。

使用终端中的 `curl`，看起来像这样：

```sh
curl -H 'Authorization: Bearer honoiscool' http://localhost:8787/auth/page
```

## 导入

```ts
import { Hono } from 'hono'
import { bearerAuth } from 'hono/bearer-auth'
```

## 使用方法

```ts
const app = new Hono()

const token = 'honoiscool'

app.use('/api/*', bearerAuth({ token }))

app.get('/api/page', (c) => {
  return c.json({ message: '您已获得授权' })
})
```

要限制特定路由 + 方法：

```ts
const app = new Hono()

const token = 'honoiscool'

app.get('/api/page', (c) => {
  return c.json({ message: '读取帖子' })
})

app.post('/api/page', bearerAuth({ token }), (c) => {
  return c.json({ message: '已创建帖子！' }, 201)
})
```

实现多个令牌（例如，任何有效的令牌可以读取，但创建/更新/删除仅限于特权令牌）：

```ts
const app = new Hono()

const readToken = 'read'
const privilegedToken = 'read+write'
const privilegedMethods = ['POST', 'PUT', 'PATCH', 'DELETE']

app.on('GET', '/api/page/*', async (c, next) => {
  // 有效令牌列表
  const bearer = bearerAuth({ token: [readToken, privilegedToken] })
  return bearer(c, next)
})
app.on(privilegedMethods, '/api/page/*', async (c, next) => {
  // 单个有效特权令牌
  const bearer = bearerAuth({ token: privilegedToken })
  return bearer(c, next)
})

// 定义 GET、POST 等处理程序
```

如果您想自己验证令牌的值，请指定 `verifyToken` 选项；返回 `true` 表示接受。

```ts
const app = new Hono()

app.use(
  '/auth-verify-token/*',
  bearerAuth({
    verifyToken: async (token, c) => {
      return token === 'dynamic-token'
    },
  })
)
```

## Options

### <Badge type="danger" text="必填" /> token: `string` | `string[]`

用于验证传入的承载令牌的字符串。

### <Badge type="info" text="可选" /> realm: `string`

realm 的域名，作为返回的 WWW-Authenticate 挑战头的一部分。默认值为 `""`。
查看更多信息： https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/WWW-Authenticate#directives

### <Badge type="info" text="可选" /> 前缀: `string`

Authorization 头部值的前缀（或称为 `schema`）。默认值为 `"Bearer"`。

### <Badge type="info" text="可选" /> headerName: `string`

请求头名称。默认值为 `Authorization`。

### <Badge type="info" text="可选" /> hashFunction: `Function`

一个用于处理哈希以安全比较身份验证令牌的函数。

### <Badge type="info" text="可选" /> verifyToken: `(token: string, c: Context) => boolean | Promise<boolean>`

用于验证令牌的函数。