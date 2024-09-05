# 流媒体助手

流媒体助手提供用于流式响应的方法。

## 导入

```ts
import { Hono } from 'hono'
import { stream, streamText, streamSSE } from 'hono/streaming'
```

## `stream()`

它返回一个简单的流响应，作为 `Response` 对象。

```ts
app.get('/stream', (c) => {
  return stream(c, async (stream) => {
    // Write a process to be executed when aborted.
    stream.onAbort(() => {
      console.log('Aborted!')
    })
    // Write a Uint8Array.
    await stream.write(new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f]))
    // Pipe a readable stream.
    await stream.pipe(anotherReadableStream)
  })
})
```

## `streamText()`

它返回一个带有 `Content-Type:text/plain`、`Transfer-Encoding:chunked` 和 `X-Content-Type-Options:nosniff` 头的流式响应。

```ts
app.get('/streamText', (c) => {
  return streamText(c, async (stream) => {
    // Write a text with a new line ('\n').
    await stream.writeln('Hello')
    // Wait 1 second.
    await stream.sleep(1000)
    // Write a text without a new line.
    await stream.write(`Hono!`)
  })
})
```

## `streamSSE()`

它允许您无缝地流式传输服务器发送事件（SSE）。

```ts
const app = new Hono()
let id = 0

app.get('/sse', async (c) => {
  return streamSSE(c, async (stream) => {
    while (true) {
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

## 错误处理

流助手的第三个参数是错误处理程序。  
此参数是可选的，如果不指定，它将作为控制台错误输出。

```ts
app.get('/stream', (c) => {
  return stream(
    c,
    async (stream) => {
      // 写一个在中止时执行的过程。
      stream.onAbort(() => {
        console.log('Aborted!')
      })
      // 写入一个 Uint8Array。
      await stream.write(
        new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f])
      )
      // 管道一个可读流。
      await stream.pipe(anotherReadableStream)
    },
    (err, stream) => {
      stream.writeln('发生错误！')
      console.error(err)
    }
  )
})
```

在回调执行后，流将自动关闭。

::: warning

如果流助手的回调函数抛出错误，Hono 的 `onError` 事件将不会被触发。

`onError` 是在响应发送之前处理错误并覆盖响应的钩子。然而，当回调函数执行时，流已经开始，因此无法被覆盖。

:::