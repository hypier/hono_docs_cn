# 为RPC分组路由

如果您想正确启用多个`app`的类型推断，可以按如下方式使用`app.route()`。

将`app.get()`或`app.post()`等方法返回的值传递给`app.route()`的第二个参数。

```ts
import { Hono } from 'hono'
import { hc } from 'hono/client'

const authorsApp = new Hono()
  .get('/', (c) => c.json({ result: 'list authors' }))
  .post('/', (c) => c.json({ result: 'create an author' }, 201))
  .get('/:id', (c) => c.json({ result: `get ${c.req.param('id')}` }))

const booksApp = new Hono()
  .get('/', (c) => c.json({ result: 'list books' }))
  .post('/', (c) => c.json({ result: 'create a book' }, 201))
  .get('/:id', (c) => c.json({ result: `get ${c.req.param('id')}` }))

const app = new Hono()
  .route('/authors', authorsApp)
  .route('/books', booksApp)

type AppType = typeof app
```

## 另请参阅

- [指南 - RPC - 客户端](/docs/guides/rpc#client)