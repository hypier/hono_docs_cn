# Remix

[Remix](https://remix.run/) 是一个基于Web标准的全栈框架。

现在，Remix和Hono可以通过fetch API一起使用。

## Remix + Hono

您可以使用 [Remix + Hono](https://github.com/sergiodxa/remix-hono) 将 Remix 作为 Hono 中间件，如下所示：

```ts
import * as build from '@remix-run/dev/server-build'
import { remix } from 'remix-hono/handler'

app.use('*', remix({ build, mode: process.env.NODE_ENV }))
```

## 另请参阅

- [Remix](https://remix.run/)
- [Remix Hono](https://github.com/sergiodxa/remix-hono)