# 路由

Hono 的路由灵活而直观。
让我们来看看。

## 基础

```ts
// HTTP 方法
app.get('/', (c) => c.text('GET /'))
app.post('/', (c) => c.text('POST /'))
app.put('/', (c) => c.text('PUT /'))
app.delete('/', (c) => c.text('DELETE /'))

// 通配符
app.get('/wild/*/card', (c) => {
  return c.text('GET /wild/*/card')
})

// 任何 HTTP 方法
app.all('/hello', (c) => c.text('任何方法 /hello'))

// 自定义 HTTP 方法
app.on('PURGE', '/cache', (c) => c.text('PURGE 方法 /cache'))

// 多个方法
app.on(['PUT', 'DELETE'], '/post', (c) =>
  c.text('PUT 或 DELETE /post')
)

// 多个路径
app.on('GET', ['/hello', '/ja/hello', '/en/hello'], (c) =>
  c.text('你好')
)
```

## 路径参数

```ts
app.get('/user/:name', (c) => {
  const name = c.req.param('name')
  ...
})
```

或者一次获取所有参数：

```ts
app.get('/posts/:id/comment/:comment_id', (c) => {
  const { id, comment_id } = c.req.param()
  ...
})
```

## 可选参数

```ts
// Will match `/api/animal` and `/api/animal/:type`
app.get('/api/animal/:type?', (c) => c.text('Animal!'))
```

## 正则表达式

```ts
app.get('/post/:date{[0-9]+}/:title{[a-z]+}', (c) => {
  const { date, title } = c.req.param()
  ...
})
```

## 包含斜杠

```ts
app.get('/posts/:filename{.+\\.png$}', (c) => {
  //...
})
```

## 链式路由

```ts
app
  .get('/endpoint', (c) => {
    return c.text('GET /endpoint')
  })
  .post((c) => {
    return c.text('POST /endpoint')
  })
  .delete((c) => {
    return c.text('DELETE /endpoint')
  })
```

## 分组

您可以使用 Hono 实例对路由进行分组，并通过 route 方法将它们添加到主应用程序中。

```ts
const book = new Hono()

book.get('/', (c) => c.text('List Books')) // GET /book
book.get('/:id', (c) => {
  // GET /book/:id
  const id = c.req.param('id')
  return c.text('Get Book: ' + id)
})
book.post('/', (c) => c.text('Create Book')) // POST /book

const app = new Hono()
app.route('/book', book)
```

## 保持基础的分组

您也可以在保持基础的情况下分组多个实例。

```ts
const book = new Hono()
book.get('/book', (c) => c.text('List Books')) // GET /book
book.post('/book', (c) => c.text('Create Book')) // POST /book

const user = new Hono().basePath('/user')
user.get('/', (c) => c.text('List Users')) // GET /user
user.post('/', (c) => c.text('Create User')) // POST /user

const app = new Hono()
app.route('/', book) // Handle /book
app.route('/', user) // Handle /user
```

## 基础路径

您可以指定基础路径。

```ts
const api = new Hono().basePath('/api')
api.get('/book', (c) => c.text('List Books')) // GET /api/book
```

## 使用主机名的路由

如果包含主机名，它工作得很好。

```ts
const app = new Hono({
  getPath: (req) => req.url.replace(/^https?:\/([^?]+).*$/, '$1'),
})

app.get('/www1.example.com/hello', (c) => c.text('hello www1'))
app.get('/www2.example.com/hello', (c) => c.text('hello www2'))
```

## 使用 `host` 头部值进行路由

Hono 可以处理 `host` 头部值，如果您在 Hono 构造函数中设置 `getPath()` 函数。

```ts
const app = new Hono({
  getPath: (req) =>
    '/' +
    req.headers.get('host') +
    req.url.replace(/^https?:\/\/[^/]+(\/[^?]*)/, '$1'),
})

app.get('/www1.example.com/hello', () => c.text('hello www1'))

// 以下请求将匹配该路由：
// new Request('http://www1.example.com/hello', {
//  headers: { host: 'www1.example.com' },
// })
```

通过应用此方法，例如，您可以通过 `User-Agent` 头部更改路由。

## 路由优先级

处理程序或中间件将按照注册顺序执行。

```ts
app.get('/book/a', (c) => c.text('a')) // a
app.get('/book/:slug', (c) => c.text('common')) // common
```

```
GET /book/a ---> `a`
GET /book/b ---> `common`
```

当一个处理程序被执行时，过程将会停止。

```ts
app.get('*', (c) => c.text('common')) // common
app.get('/foo', (c) => c.text('foo')) // foo
```

```
GET /foo ---> `common` // foo 不会被分发
```

如果您有希望执行的中间件，请将代码写在处理程序之前。

```ts
app.use(logger())
app.get('/foo', (c) => c.text('foo'))
```

如果您想要一个 "_fallback_" 处理程序，请将代码写在其他处理程序的下面。

```ts
app.get('/bar', (c) => c.text('bar')) // bar
app.get('*', (c) => c.text('fallback')) // fallback
```

```
GET /bar ---> `fallback`
```

## 分组顺序

请注意，分组路由的错误很难察觉。
`route()` 函数从第二个参数（如 `three` 或 `two`）中获取存储的路由，并将其添加到自己的（`two` 或 `app`）路由中。

```ts
three.get('/hi', (c) => c.text('hi'))
two.route('/three', three)
app.route('/two', two)

export default app
```

它将返回 200 响应。

```
GET /two/three/hi ---> `hi`
```

然而，如果它们的顺序错误，将返回 404。

```ts
three.get('/hi', (c) => c.text('hi'))
app.route('/two', two) // `two` 没有路由
two.route('/three', three)

export default app
```

```
GET /two/three/hi ---> 404 Not Found
```