# Cookie Helper

Cookie Helper 提供了一个简单的接口来管理 cookies，使开发者能够轻松地设置、解析和删除 cookies。

## 导入

```ts
import { Hono } from 'hono'
import {
  getCookie,
  getSignedCookie,
  setCookie,
  setSignedCookie,
  deleteCookie,
} from 'hono/cookie'
```

## 用法

**注意**：由于使用了 WebCrypto API 创建 HMAC SHA-256 签名，设置和获取签名 cookie 返回一个 Promise。

```ts
const app = new Hono()

app.get('/cookie', (c) => {
  const allCookies = getCookie(c)
  const yummyCookie = getCookie(c, 'yummy_cookie')
  // ...
  setCookie(c, 'delicious_cookie', 'macha')
  deleteCookie(c, 'delicious_cookie')
  //
})

app.get('/signed-cookie', async (c) => {
  const secret = 'secret ingredient'
  // `getSignedCookie` 如果签名被篡改或无效，将返回 `false`
  const allSignedCookies = await getSignedCookie(c, secret)
  const fortuneCookie = await getSignedCookie(
    c,
    secret,
    'fortune_cookie'
  )
  // ...
  const anotherSecret = 'secret chocolate chips'
  await setSignedCookie(c, 'great_cookie', 'blueberry', anotherSecret)
  deleteCookie(c, 'great_cookie')
  //
})
```

## Options

### `setCookie` & `setSignedCookie`

- domain: `string`
- expires: `Date`
- httpOnly: `boolean`
- maxAge: `number`
- path: `string`
- secure: `boolean`
- sameSite: `'Strict'` | `'Lax'` | `'None'`
- prefix: `secure` | `'host'`
- partitioned: `boolean`

示例：

```ts
// Regular cookies
setCookie(c, 'great_cookie', 'banana', {
  path: '/',
  secure: true,
  domain: 'example.com',
  httpOnly: true,
  maxAge: 1000,
  expires: new Date(Date.UTC(2000, 11, 24, 10, 30, 59, 900)),
  sameSite: 'Strict',
})

// Signed cookies
await setSignedCookie(
  c,
  'fortune_cookie',
  'lots-of-money',
  'secret ingredient',
  {
    path: '/',
    secure: true,
    domain: 'example.com',
    httpOnly: true,
    maxAge: 1000,
    expires: new Date(Date.UTC(2000, 11, 24, 10, 30, 59, 900)),
    sameSite: 'Strict',
  }
)
```

### `deleteCookie`

- path: `string`
- secure: `boolean`
- domain: `string`

示例：

```ts
deleteCookie(c, 'banana', {
  path: '/',
  secure: true,
  domain: 'example.com',
})
```

`deleteCookie` 返回已删除的值：

```ts
const deletedCookie = deleteCookie(c, 'delicious_cookie')
```

## `__Secure-` 和 `__Host-` 前缀

Cookie 辅助工具支持 `__Secure-` 和 `__Host-` 前缀用于 cookie 名称。

如果您想验证 cookie 名称是否具有前缀，请指定前缀选项。

```ts
const securePrefixCookie = getCookie(c, 'yummy_cookie', 'secure')
const hostPrefixCookie = getCookie(c, 'yummy_cookie', 'host')

const securePrefixSignedCookie = await getSignedCookie(
  c,
  secret,
  'fortune_cookie',
  'secure'
)
const hostPrefixSignedCookie = await getSignedCookie(
  c,
  secret,
  'fortune_cookie',
  'host'
)
```

此外，如果您希望在设置 cookie 时指定前缀，请为前缀选项指定一个值。

```ts
setCookie(c, 'delicious_cookie', 'macha', {
  prefix: 'secure', // 或 `host`
})

await setSignedCookie(
  c,
  'delicious_cookie',
  'macha',
  'secret choco chips',
  {
    prefix: 'secure', // 或 `host`
  }
)
```

## 遵循最佳实践

新的 Cookie RFC（即 cookie-bis）和 CHIPS 包含了一些开发人员应该遵循的 Cookie 设置最佳实践。

- [RFC6265bis-13](https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-rfc6265bis-13)
  - `Max-Age`/`Expires` 限制
  - `__Host-`/`__Secure-` 前缀限制
- [CHIPS-01](https://www.ietf.org/archive/id/draft-cutler-httpbis-partitioned-cookies-01.html)
  - `Partitioned` 限制

Hono 正在遵循最佳实践。
当在以下条件下解析 cookies 时，cookie helper 将抛出 `Error`：

- cookie 名称以 `__Secure-` 开头，但未设置 `secure` 选项。
- cookie 名称以 `__Host-` 开头，但未设置 `secure` 选项。
- cookie 名称以 `__Host-` 开头，但 `path` 不是 `/`。
- cookie 名称以 `__Host-` 开头，但未设置 `domain`。
- `maxAge` 选项值大于 400 天。
- `expires` 选项值比当前时间晚 400 天。