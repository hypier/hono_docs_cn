# 超时中间件

超时中间件使您能够轻松管理应用程序中的请求超时。它允许您为请求设置最长持续时间，并可选择在超过指定超时时间时定义自定义错误响应。

## 导入

```ts
import { Hono } from 'hono'
import { timeout } from 'hono/timeout'
```

## 用法

以下是如何使用超时中间件的默认设置和自定义设置：

默认设置：

```ts
const app = new Hono()

// 应用 5 秒超时
app.use('/api', timeout(5000))

// 处理一个路由
app.get('/api/data', async (c) => {
  // 你的路由处理逻辑
  return c.json({ data: 'Your data here' })
})
```

自定义设置：

```ts
import { HTTPException } from 'hono/http-exception'

// 自定义异常工厂函数
const customTimeoutException = (context) =>
  new HTTPException(408, {
    message: `请求超时，等待了 ${context.req.headers.get(
      'Duration'
    )} 秒。请稍后再试。`,
  })

// 静态异常消息
// const customTimeoutException = new HTTPException(408, {
//   message: '操作超时。请稍后再试。'
// });

// 应用 1 分钟超时和自定义异常
app.use('/api/long-process', timeout(60000, customTimeoutException))

app.get('/api/long-process', async (c) => {
  // 模拟一个长时间的过程
  await new Promise((resolve) => setTimeout(resolve, 61000))
  return c.json({ data: '这通常需要更长时间' })
})
```

## 注意事项

- 超时的持续时间可以以毫秒为单位指定。如果指定的持续时间被超过，中间件将自动拒绝该 Promise，并可能抛出一个错误。

- 超时中间件不能与流一起使用。因此，请将 `stream.close` 和 `setTimeout` 一起使用。

```ts
app.get('/sse', async (c) => {
  let id = 0
  let running = true
  let timer: number | undefined

  return streamSSE(c, async (stream) => {
    timer = setTimeout(() => {
      console.log('Stream timeout reached, closing stream')
      stream.close()
    }, 3000) as unknown as number

    stream.onAbort(async () => {
      console.log('Client closed connection')
      running = false
      clearTimeout(timer)
    })

    while (running) {
      const message = `It is ${new Date().toISOString()}`
      await stream.writeSSE({
        data: message,
        event: 'time-update',
        id: String(id++),
      })
      await stream.sleep(1000)
    }
  })
})
```

## 中间件冲突

注意中间件的顺序，特别是在使用错误处理或其他与时间相关的中间件时，因为这可能会影响该超时中间件的行为。