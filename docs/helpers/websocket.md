# WebSocket Helper

WebSocket Helper 是 Hono 应用中服务器端 WebSocket 的辅助工具。  
目前可用的适配器包括 Cloudflare Workers / Pages、Deno 和 Bun。

## 导入

::: code-group

```ts [Cloudflare Workers]
import { Hono } from 'hono'
import { upgradeWebSocket } from 'hono/cloudflare-workers'
```

```ts [Deno]
import { Hono } from 'hono'
import { upgradeWebSocket } from 'hono/deno'
```

```ts [Bun]
import { Hono } from 'hono'
import { createBunWebSocket } from 'hono/bun'

const { upgradeWebSocket, websocket } = createBunWebSocket()

// ...

Bun.serve({
  fetch: app.fetch,
  websocket,
})
```

:::

如果您使用 Node.js，可以使用 [@hono/node-ws](https://github.com/honojs/middleware/tree/main/packages/node-ws)。

## `upgradeWebSocket()`

`upgradeWebSocket()` 返回一个处理 WebSocket 的处理程序。

```ts
const app = new Hono()

app.get(
  '/ws',
  upgradeWebSocket((c) => {
    return {
      onMessage(event, ws) {
        console.log(`Message from client: ${event.data}`)
        ws.send('Hello from server!')
      },
      onClose: () => {
        console.log('Connection closed')
      },
    }
  })
)
```

可用事件：

- `onOpen` - 目前，Cloudflare Workers 不支持该功能。
- `onMessage`
- `onClose`
- `onError`

::: warning

如果您在使用 WebSocket Helper 的路由上使用修改头部的中间件（例如，应用 CORS），您可能会遇到一个错误，提示您无法修改不可变的头部。这是因为 `upgradeWebSocket()` 也会在内部更改头部。

因此，如果您同时使用 WebSocket Helper 和中间件，请务必小心。

:::

## RPC模式

使用 WebSocket Helper 定义的处理程序支持 RPC 模式。

```ts
// server.ts
const wsApp = app.get(
  '/ws',
  upgradeWebSocket((c) => {
    //...
  })
)

export type WebSocketApp = typeof wsApp

// client.ts
const client = hc<WebSocketApp>('http://localhost:8787')
const socket = client.ws.$ws() // 客户端的 WebSocket 对象
```

## 示例

请参阅使用 WebSocket Helper 的示例。

### 服务器和客户端

```ts
// server.ts
import { Hono } from 'hono'
import { upgradeWebSocket } from 'hono/cloudflare-workers'

const app = new Hono().get(
  '/ws',
  upgradeWebSocket(() => {
    return {
      onMessage: (event) => {
        console.log(event.data)
      },
    }
  })
)

export default app
```

```ts
// client.ts
import { hc } from 'hono/client'
import type app from './server'

const client = hc<typeof app>('http://localhost:8787')
const ws = client.ws.$ws(0)

ws.addEventListener('open', () => {
  setInterval(() => {
    ws.send(new Date().toString())
  }, 1000)
})
```

### 带有 JSX 的 Bun

```tsx
import { Hono } from 'hono'
import { createBunWebSocket } from 'hono/bun'

const { upgradeWebSocket, websocket } = createBunWebSocket()

const app = new Hono()

app.get('/', (c) => {
  return c.html(
    <html>
      <head>
        <meta charset='UTF-8' />
      </head>
      <body>
        <div id='now-time'></div>
        <script
          dangerouslySetInnerHTML={{
            __html: `
        const ws = new WebSocket('ws://localhost:3000/ws')
        const $nowTime = document.getElementById('now-time')
        ws.onmessage = (event) => {
          $nowTime.textContent = event.data
        }
        `,
          }}
        ></script>
      </body>
    </html>
  )
})

const ws = app.get(
  '/ws',
  upgradeWebSocket((c) => {
    let intervalId
    return {
      onOpen(_event, ws) {
        intervalId = setInterval(() => {
          ws.send(new Date().toString())
        }, 200)
      },
      onClose() {
        clearInterval(intervalId)
      },
    }
  })
)

Bun.serve({
  fetch: app.fetch,
  websocket,
})
```