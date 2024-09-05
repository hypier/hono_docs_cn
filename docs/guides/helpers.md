# 辅助工具

辅助工具可用于帮助开发您的应用程序。与中间件不同，它们不作为处理程序，而是提供有用的功能。

例如，以下是如何使用 [Cookie 辅助工具](/docs/helpers/cookie) 的示例：

```ts
import { getCookie, setCookie } from 'hono/cookie'

const app = new Hono()

app.get('/cookie', (c) => {
  const yummyCookie = getCookie(c, 'yummy_cookie')
  // ...
  setCookie(c, 'delicious_cookie', 'macha')
  //
})
```

## 可用助手

- [Accepts](/docs/helpers/accepts)
- [Adapter](/docs/helpers/adapter)
- [Cookie](/docs/helpers/cookie)
- [css](/docs/helpers/css)
- [Dev](/docs/helpers/dev)
- [Factory](/docs/helpers/factory)
- [html](/docs/helpers/html)
- [JWT](/docs/helpers/jwt)
- [SSG](/docs/helpers/ssg)
- [Streaming](/docs/helpers/streaming)
- [Testing](/docs/helpers/testing)
- [WebSocket](/docs/helpers/websocket)