# Cloudflare Durable Objects

通过使用 Hono，您可以轻松编写 [Durable Objects](https://developers.cloudflare.com/durable-objects/) 应用程序。

Hono 可以处理 Durable Objects 的 `fetch` 事件，您可以将其与强大的路由器一起使用。

```ts
import { Hono } from 'hono'

export class Counter {
  value: number = 0
  state: DurableObjectState
  app: Hono = new Hono()

  constructor(state: DurableObjectState) {
    this.state = state
    this.state.blockConcurrencyWhile(async () => {
      const stored = await this.state.storage?.get<number>('value')
      this.value = stored || 0
    })

    this.app.get('/increment', async (c) => {
      const currentValue = ++this.value
      await this.state.storage?.put('value', this.value)
      return c.text(currentValue.toString())
    })

    this.app.get('/decrement', async (c) => {
      const currentValue = --this.value
      await this.state.storage?.put('value', this.value)
      return c.text(currentValue.toString())
    })

    this.app.get('/', async (c) => {
      return c.text(this.value.toString())
    })
  }

  async fetch(request: Request) {
    return this.app.fetch(request)
  }
}
```

## 另见

- [Durable Objects](https://developers.cloudflare.com/durable-objects/)
- [Hono 示例中的 Durable Objects](https://github.com/honojs/examples/blob/main/durable-objects/README.md)