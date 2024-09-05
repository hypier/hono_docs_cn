# RPC

RPC 功能允许在服务器和客户端之间共享 API 规范。

您可以导出由 Validator 指定的输入类型和 `json()` 发出的输出类型。Hono Client 将能够导入它。

> [!NOTE]  
> 为了确保 RPC 类型在单一代码库中正常工作，请在客户端和服务器的 tsconfig.json 文件中，将 `compilerOptions` 中的 `"strict": true` 设置为 `true`。 [阅读更多。](https://github.com/honojs/hono/issues/2270#issuecomment-2143745118)

## 服务器

您需要在服务器端做的就是编写一个验证器并创建一个变量 `route`。以下示例使用 [Zod Validator](https://github.com/honojs/middleware/tree/main/packages/zod-validator)。

```ts{1}
const route = app.post(
  '/posts',
  zValidator(
    'form',
    z.object({
      title: z.string(),
      body: z.string(),
    })
  ),
  (c) => {
    // ...
    return c.json(
      {
        ok: true,
        message: 'Created!',
      },
      201
    )
  }
)
```

然后，导出类型以与客户端共享 API 规范。

```ts
export type AppType = typeof route
```

## 客户端

在客户端，首先导入 `hc` 和 `AppType`。

```ts
import { AppType } from '.'
import { hc } from 'hono/client'
```

`hc` 是一个创建客户端的函数。将 `AppType` 作为泛型传递，并将服务器 URL 作为参数指定。

```ts
const client = hc<AppType>('http://localhost:8787/')
```

调用 `client.{path}.{method}` 并将您希望发送到服务器的数据作为参数传递。

```ts
const res = await client.posts.$post({
  form: {
    title: 'Hello',
    body: 'Hono is a cool project',
  },
})
```

`res` 与 "fetch" 响应兼容。您可以使用 `res.json()` 从服务器检索数据。

```ts
if (res.ok) {
  const data = await res.json()
  console.log(data.message)
}
```

::: warning 文件上传

目前，客户端不支持文件上传。

:::

## 状态码

如果您在 `c.json()` 中明确指定状态码，例如 `200` 或 `404`，它将作为传递给客户端的类型添加。

```ts
// server.ts
const app = new Hono().get(
  '/posts',
  zValidator(
    'query',
    z.object({
      id: z.string(),
    })
  ),
  async (c) => {
    const { id } = c.req.valid('query')
    const post: Post | undefined = await getPost(id)

    if (post === undefined) {
      return c.json({ error: 'not found' }, 404) // 指定 404
    }

    return c.json({ post }, 200) // 指定 200
  }
)

export type AppType = typeof app
```

您可以通过状态码获取数据。

```ts
// client.ts
const client = hc<AppType>('http://localhost:8787/')

const res = await client.posts.$get({
  query: {
    id: '123',
  },
})

if (res.status === 404) {
  const data: { error: string } = await res.json()
  console.log(data.error)
}

if (res.ok) {
  const data: { post: Post } = await res.json()
  console.log(data.post)
}

// { post: Post } | { error: string }
type ResponseType = InferResponseType<typeof client.posts.$get>

// { post: Post }
type ResponseType200 = InferResponseType<
  typeof client.posts.$get,
  200
>
```

## 路径参数

您还可以处理包含路径参数的路由。

```ts
const route = app.get(
  '/posts/:id',
  zValidator(
    'query',
    z.object({
      page: z.string().optional(),
    })
  ),
  (c) => {
    // ...
    return c.json({
      title: 'Night',
      body: 'Time to sleep',
    })
  }
)
```

使用 `param` 指定您想要包含在路径中的字符串。

```ts
const res = await client.posts[':id'].$get({
  param: {
    id: '123',
  },
  query: {},
})
```

## 头部

您可以将头部附加到请求中。

```ts
const res = await client.search.$get(
  {
    //...
  },
  {
    headers: {
      'X-Custom-Header': 'Here is Hono Client',
      'X-User-Agent': 'hc',
    },
  }
)
```

要将公共头部添加到所有请求中，请将其作为参数指定给 `hc` 函数。

```ts
const client = hc<AppType>('/api', {
  headers: {
    Authorization: 'Bearer TOKEN',
  },
})
```

## `init` 选项

您可以将 fetch 的 `RequestInit` 对象作为 `init` 选项传递给请求。下面是一个中止请求的示例。

```ts
import { hc } from 'hono/client'

const client = hc<AppType>('http://localhost:8787/')

const abortController = new AbortController()
const res = await client.api.posts.$post(
  {
    json: {
      // Request body
    },
  },
  {
    // RequestInit object
    init: {
      signal: abortController.signal,
    },
  }
)

// ...

abortController.abort()
```

::: info
由 `init` 定义的 `RequestInit` 对象具有最高优先级。它可以用来覆盖其他选项设置的内容，例如 `body | method | headers`。
:::

## `$url()`

您可以通过使用 `$url()` 获取一个 `URL` 对象来访问端点。

::: warning
您必须传入一个绝对 URL 才能正常工作。传入相对 URL `/` 将导致以下错误。

`Uncaught TypeError: Failed to construct 'URL': Invalid URL`

```ts
// ❌ Will throw error
const client = hc<AppType>('/')
client.api.post.$url()

// ✅ Will work as expected
const client = hc<AppType>('http://localhost:8787/')
client.api.post.$url()
```

:::

```ts
const route = app
  .get('/api/posts', (c) => c.json({ posts }))
  .get('/api/posts/:id', (c) => c.json({ post }))

const client = hc<typeof route>('http://localhost:8787/')

let url = client.api.posts.$url()
console.log(url.pathname) // `/api/posts`

url = client.api.posts[':id'].$url({
  param: {
    id: '123',
  },
})
console.log(url.pathname) // `/api/posts/123`
```

## 自定义 `fetch` 方法

您可以设置自定义的 `fetch` 方法。

在以下 Cloudflare Worker 的示例脚本中，使用了服务绑定的 `fetch` 方法，而不是默认的 `fetch`。

```toml
# wrangler.toml
services = [
  { binding = "AUTH", service = "auth-service" },
]
```

```ts
// src/client.ts
const client = hc<CreateProfileType>('/', {
  fetch: c.env.AUTH.fetch.bind(c.env.AUTH),
})
```

## 推断

使用 `InferRequestType` 和 `InferResponseType` 来了解请求的对象类型和返回的对象类型。

```ts
import type { InferRequestType, InferResponseType } from 'hono/client'

// InferRequestType
const $post = client.todo.$post
type ReqType = InferRequestType<typeof $post>['form']

// InferResponseType
type ResType = InferResponseType<typeof $post>
```

## 使用 SWR

您还可以使用一个 React Hook 库，例如 [SWR](https://swr.vercel.app)。

```tsx
import useSWR from 'swr'
import { hc } from 'hono/client'
import type { InferRequestType } from 'hono/client'
import { AppType } from '../functions/api/[[route]]'

const App = () => {
  const client = hc<AppType>('/api')
  const $get = client.hello.$get

  const fetcher =
    (arg: InferRequestType<typeof $get>) => async () => {
      const res = await $get(arg)
      return await res.json()
    }

  const { data, error, isLoading } = useSWR(
    'api-hello',
    fetcher({
      query: {
        name: 'SWR',
      },
    })
  )

  if (error) return <div>加载失败</div>
  if (isLoading) return <div>加载中...</div>

  return <h1>{data?.message}</h1>
}

export default App
```

## 在大型应用程序中使用 RPC

在大型应用程序的情况下，例如在 [构建大型应用程序](/docs/guides/best-practices#building-a-larger-application) 中提到的示例，您需要小心推断的类型。 
一种简单的方法是将处理程序链接在一起，以便类型始终被推断。

```ts
// authors.ts
import { Hono } from 'hono'

const app = new Hono()
  .get('/', (c) => c.json('list authors'))
  .post('/', (c) => c.json('create an author', 201))
  .get('/:id', (c) => c.json(`get ${c.req.param('id')}`))

export default app
```

```ts
// books.ts
import { Hono } from 'hono'

const app = new Hono()
  .get('/', (c) => c.json('list books'))
  .post('/', (c) => c.json('create a book', 201))
  .get('/:id', (c) => c.json(`get ${c.req.param('id')}`))

export default app
```

然后，您可以像往常一样导入子路由，并确保也将它们的处理程序链接在一起，因为在这种情况下这是应用程序的顶层，这是我们想要导出的类型。

```ts
// index.ts
import { Hono } from 'hono'
import authors from './authors'
import books from './books'

const app = new Hono()

const routes = app.route('/authors', authors).route('/books', books)

export default app
export type AppType = typeof routes
```

现在，您可以使用注册的 AppType 创建一个新客户端，并像往常一样使用它。