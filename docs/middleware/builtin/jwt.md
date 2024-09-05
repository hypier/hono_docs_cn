# JWT Auth Middleware

JWT Auth Middleware通过验证JWT令牌提供身份验证。
如果未设置`cookie`选项，中间件将检查`Authorization`头。

:::info
从客户端发送的Authorization头必须具有指定的方案。

示例：`Bearer my.token.value` 或 `Basic my.token.value`
:::

## 导入

```ts
import { Hono } from 'hono'
import { jwt } from 'hono/jwt'
import type { JwtVariables } from 'hono/jwt'
```

## 用法

```ts
// 指定变量类型以推断 `c.get('jwtPayload')`：
type Variables = JwtVariables

const app = new Hono<{ Variables: Variables }>()

app.use(
  '/auth/*',
  jwt({
    secret: 'it-is-very-secret',
  })
)

app.get('/auth/page', (c) => {
  return c.text('您已获得授权')
})
```

获取负载：

```ts
const app = new Hono()

app.use(
  '/auth/*',
  jwt({
    secret: 'it-is-very-secret',
  })
)

app.get('/auth/page', (c) => {
  const payload = c.get('jwtPayload')
  return c.json(payload) // 例如: { "sub": "1234567890", "name": "John Doe", "iat": 1516239022 }
})
```

::: 提示

`jwt()` 只是一个中间件函数。如果您想使用环境变量（例如：`c.env.JWT_SECRET`），可以按如下方式使用：

```js
app.use('/auth/*', (c, next) => {
  const jwtMiddleware = jwt({
    secret: c.env.JWT_SECRET,
  })
  return jwtMiddleware(c, next)
})
```

:::

## 选项

### <Badge type="danger" text="必填" /> secret: `string`

您秘密密钥的值。

### <Badge type="info" text="可选" /> cookie: `string`

如果设置了此值，则将使用该值作为键从 cookie 头中检索该值，然后将其验证为令牌。

### <Badge type="info" text="可选" /> alg: `string`

用于验证的算法类型。  
默认值为 `HS256`。

可用类型有 `HS256` | `HS384` | `HS512` | `RS256` | `RS384` | `RS512` | `PS256` | `PS384` | `PS512` | `ES256` | `ES384` | `ES512` | `EdDSA`。