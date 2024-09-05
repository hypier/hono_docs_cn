# Hono Stacks

Hono 使简单的事情变得简单，使困难的事情也变得简单。
它不仅适合返回 JSON。
而且非常适合构建包括 REST API 服务器和客户端在内的全栈应用程序。

## RPC

Hono的RPC功能允许您在代码几乎没有变化的情况下共享API规范。  
由`hc`生成的客户端将读取规范并访问端点类型安全。

以下库使其成为可能。

- Hono - API服务器
- [Zod](https://zod.dev) - 验证器
- [Zod Validator Middleware](https://github.com/honojs/middleware/tree/main/packages/zod-validator)
- `hc` - HTTP客户端

我们可以将这些组件的集合称为**Hono Stack**。  
现在让我们用它创建一个API服务器和一个客户端。

## 编写 API

首先，编写一个接收 GET 请求并返回 JSON 的端点。

```ts
import { Hono } from 'hono'

const app = new Hono()

app.get('/hello', (c) => {
  return c.json({
    message: `Hello!`,
  })
})
```

## 使用 Zod 进行验证

使用 Zod 验证以接收查询参数的值。

![SC](/images/sc01.gif)

```ts
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

app.get(
  '/hello',
  zValidator(
    'query',
    z.object({
      name: z.string(),
    })
  ),
  (c) => {
    const { name } = c.req.valid('query')
    return c.json({
      message: `Hello! ${name}`,
    })
  }
)
```

## 分享类型

要发出端点规范，请导出其类型。

```ts{1,17}
const route = app.get(
  '/hello',
  zValidator(
    'query',
    z.object({
      name: z.string(),
    })
  ),
  (c) => {
    const { name } = c.req.valid('query')
    return c.json({
      message: `Hello! ${name}`,
    })
  }
)

export type AppType = typeof route
```

## 客户端

接下来，客户端实现。
通过将 AppType 类型作为泛型传递给 `hc` 创建一个客户端对象。
然后，神奇地，完成工作，端点路径和请求类型被建议。

![SC](/images/sc03.gif)

```ts
import { AppType } from './server'
import { hc } from 'hono/client'

const client = hc<AppType>('/api')
const res = await client.hello.$get({
  query: {
    name: 'Hono',
  },
})
```

`Response` 与 fetch API 兼容，但可以通过 `json()` 获取的数据有类型。

![SC](/images/sc04.gif)

```ts
const data = await res.json()
console.log(`${data.message}`)
```

共享 API 规范意味着您可以了解服务器端的更改。

![SS](/images/ss03.png)

## 使用 React

您可以使用 React 在 Cloudflare Pages 上创建应用程序。

API 服务器。

```ts
// functions/api/[[route]].ts
import { Hono } from 'hono'
import { handle } from 'hono/cloudflare-pages'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

const app = new Hono()

const schema = z.object({
  id: z.string(),
  title: z.string(),
})

type Todo = z.infer<typeof schema>

const todos: Todo[] = []

const route = app
  .post('/todo', zValidator('form', schema), (c) => {
    const todo = c.req.valid('form')
    todos.push(todo)
    return c.json({
      message: 'created!',
    })
  })
  .get((c) => {
    return c.json({
      todos,
    })
  })

export type AppType = typeof route

export const onRequest = handle(app, '/api')
```

使用 React 和 React Query 的客户端。

```tsx
// src/App.tsx
import {
  useQuery,
  useMutation,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { AppType } from '../functions/api/[[route]]'
import { hc, InferResponseType, InferRequestType } from 'hono/client'

const queryClient = new QueryClient()
const client = hc<AppType>('/api')

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Todos />
    </QueryClientProvider>
  )
}

const Todos = () => {
  const query = useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const res = await client.todo.$get()
      return await res.json()
    },
  })

  const $post = client.todo.$post

  const mutation = useMutation<
    InferResponseType<typeof $post>,
    Error,
    InferRequestType<typeof $post>['form']
  >(
    async (todo) => {
      const res = await $post({
        form: todo,
      })
      return await res.json()
    },
    {
      onSuccess: async () => {
        queryClient.invalidateQueries({ queryKey: ['todos'] })
      },
      onError: (error) => {
        console.log(error)
      },
    }
  )

  return (
    <div>
      <button
        onClick={() => {
          mutation.mutate({
            id: Date.now().toString(),
            title: '编写代码',
          })
        }}
      >
        添加待办事项
      </button>

      <ul>
        {query.data?.todos.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </div>
  )
}
```