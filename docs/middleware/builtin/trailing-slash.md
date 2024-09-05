# 尾部斜杠中间件

该中间件处理 GET 请求中 URL 的尾部斜杠。

`appendTrailingSlash` 会在内容未找到时将 URL 重定向到添加了尾部斜杠的地址。同时，`trimTrailingSlash` 将移除尾部斜杠。

## 导入

```ts
import { Hono } from 'hono'
import {
  appendTrailingSlash,
  trimTrailingSlash,
} from 'hono/trailing-slash'
```

## 用法

将GET请求`/about/me`重定向到`/about/me/`的示例。

```ts
import { Hono } from 'hono'
import { appendTrailingSlash } from 'hono/trailing-slash'

const app = new Hono({ strict: true })

app.use(appendTrailingSlash())
app.get('/about/me/', (c) => c.text('With Trailing Slash'))
```

将GET请求`/about/me/`重定向到`/about/me`的示例。

```ts
import { Hono } from 'hono'
import { trimTrailingSlash } from 'hono/trailing-slash'

const app = new Hono({ strict: true })

app.use(trimTrailingSlash())
app.get('/about/me', (c) => c.text('Without Trailing Slash'))
```

## 注意

当请求方法为 `GET` 且响应状态为 `404` 时，将启用此功能。