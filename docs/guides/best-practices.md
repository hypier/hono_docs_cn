# 最佳实践

Hono 非常灵活。您可以按照自己的喜好编写应用程序。  
然而，有一些最佳实践是更值得遵循的。  
```  
// 代码示例  
```

## 尽量不要创建“控制器”

在可能的情况下，您应该避免创建“类似于 Ruby on Rails 的控制器”。

```ts
// 🙁
// 一个类似于 RoR 的控制器
const booksList = (c: Context) => {
  return c.json('list books')
}

app.get('/books', booksList)
```

问题与类型有关。例如，路径参数在控制器中无法推断，而不需要编写复杂的泛型。

```ts
// 🙁
// 一个类似于 RoR 的控制器
const bookPermalink = (c: Context) => {
  const id = c.req.param('id') // 无法推断路径参数
  return c.json(`get ${id}`)
}
```

因此，您不需要创建类似于 RoR 的控制器，而应该在路径定义后直接编写处理程序。

```ts
// 😃
app.get('/books/:id', (c) => {
  const id = c.req.param('id') // 可以推断路径参数
  return c.json(`get ${id}`)
})
```

## `factory.createHandlers()` 在 `hono/factory`

如果您仍然想创建一个类似 RoR 的控制器，请在 [`hono/factory`](/docs/helpers/factory) 中使用 `factory.createHandlers()`。如果您使用这个，类型推断将会正确工作。

```ts
import { createFactory } from 'hono/factory'
import { logger } from 'hono/logger'

// ...

// 😃
const factory = createFactory()

const middleware = factory.createMiddleware(async (c, next) => {
  c.set('foo', 'bar')
  await next()
})

const handlers = factory.createHandlers(logger(), middleware, (c) => {
  return c.json(c.var.foo)
})

app.get('/api', ...handlers)
```

## 构建更大的应用程序

使用 `app.route()` 构建更大的应用程序，而无需创建类似于 "Ruby on Rails" 的控制器。

如果您的应用程序有 `/authors` 和 `/books` 端点，并且您希望将文件与 `index.ts` 分开，可以创建 `authors.ts` 和 `books.ts`。

```ts
// authors.ts
import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => c.json('list authors'))
app.post('/', (c) => c.json('create an author', 201))
app.get('/:id', (c) => c.json(`get ${c.req.param('id')}`))

export default app
```

```ts
// books.ts
import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => c.json('list books'))
app.post('/', (c) => c.json('create a book', 201))
app.get('/:id', (c) => c.json(`get ${c.req.param('id')}`))

export default app
```

然后，导入它们并使用 `app.route()` 挂载到路径 `/authors` 和 `/books`。

```ts
// index.ts
import { Hono } from 'hono'
import authors from './authors'
import books from './books'

const app = new Hono()

app.route('/authors', authors)
app.route('/books', books)

export default app
```