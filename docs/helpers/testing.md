# 测试助手

测试助手提供了简化 Hono 应用程序测试的功能。

## 导入

```ts
import { Hono } from 'hono'
import { testClient } from 'hono/testing'
```

## `testClient()`

`testClient()` 的第一个参数是 Hono 的实例，并返回一个 [Hono Client](/docs/guides/rpc#client) 对象。通过使用这个，你可以在编辑器中完成请求的定义。

```ts
import { testClient } from 'hono/testing'

it('test', async () => {
  const app = new Hono().get('/search', (c) =>
    c.json({ hello: 'world' })
  )
  const res = await testClient(app).search.$get()

  expect(await res.json()).toEqual({ hello: 'world' })
})
```