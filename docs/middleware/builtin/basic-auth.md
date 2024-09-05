# Basic Authentication Middleware

This middleware can apply basic authentication to specified paths. Implementing basic authentication on Cloudflare Workers or other platforms is more complex than it seems, but with this middleware, it's a breeze.

For more information about the basic authentication mechanism, see the [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#basic_authentication_scheme).

## 导入

```ts
import { Hono } from 'hono'
import { basicAuth } from 'hono/basic-auth'
```

## 用法

```ts
const app = new Hono()

app.use(
  '/auth/*',
  basicAuth({
    username: 'hono',
    password: 'acoolproject',
  })
)

app.get('/auth/page', (c) => {
  return c.text('您已获得授权')
})
```

要限制特定路由 + 方法：

```ts
const app = new Hono()

app.get('/auth/page', (c) => {
  return c.text('查看页面')
})

app.delete(
  '/auth/page',
  basicAuth({ username: 'hono', password: 'acoolproject' }),
  (c) => {
    return c.text('页面已删除')
  }
)
```

如果您想自行验证用户，请指定 `verifyUser` 选项；返回 `true` 表示接受。

```ts
const app = new Hono()

app.use(
  basicAuth({
    verifyUser: (username, password, c) => {
      return (
        username === 'dynamic-user' && password === 'hono-password'
      )
    },
  })
)
```

## Options

### <Badge type="danger" text="必填" /> username: `string`

进行身份验证的用户的用户名。

### <Badge type="danger" text="必填" /> 密码: `string`

用于对提供的用户名进行身份验证的密码值。

### <Badge type="info" text="optional" /> realm: `string`

领域的域名，作为返回的 WWW-Authenticate 挑战头的一部分。默认值为 `"Secure Area"`。  
查看更多： https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/WWW-Authenticate#directives

### <Badge type="info" text="可选" /> hashFunction: `Function`

用于处理密码安全比较的哈希函数。

### <Badge type="info" text="可选" /> verifyUser: `(username: string, password: string, c: Context) => boolean | Promise<boolean>`

用于验证用户的函数。

## More Options

### <Badge type="info" text="可选" /> ...用户: `{ username: string, password: string }[]`

## Recipe

### 定义多个用户

此中间件还允许您传递包含定义更多 `username` 和 `password` 对的对象的任意参数。

```ts
app.use(
  '/auth/*',
  basicAuth(
    {
      username: 'hono',
      password: 'acoolproject',
      // 在第一个对象中定义其他参数
      realm: 'www.example.com',
    },
    {
      username: 'hono-admin',
      password: 'super-secure',
      // 这里不能重新定义其他参数
    },
    {
      username: 'hono-user-1',
      password: 'a-secret',
      // 或者在这里
    }
  )
)
```

或者不那么硬编码：

```ts
import { users } from '../config/users'

app.use(
  '/auth/*',
  basicAuth(
    {
      realm: 'www.example.com',
      ...users[0],
    },
    ...users.slice(1)
  )
)
```