# Zod OpenAPI

[Zod OpenAPI Hono](https://github.com/honojs/middleware/tree/main/packages/zod-openapi) 是一个扩展的 Hono 类，支持 OpenAPI。通过它，您可以使用 [Zod](https://zod.dev/) 验证值和类型，并生成 OpenAPI Swagger 文档。在本网站上，仅展示基本用法。

首先，使用 Zod 定义您的模式。`z` 对象应从 `@hono/zod-openapi` 导入：

```ts
import { z } from '@hono/zod-openapi'

const ParamsSchema = z.object({
  id: z
    .string()
    .min(3)
    .openapi({
      param: {
        name: 'id',
        in: 'path',
      },
      example: '1212121',
    }),
})

const UserSchema = z
  .object({
    id: z.string().openapi({
      example: '123',
    }),
    name: z.string().openapi({
      example: 'John Doe',
    }),
    age: z.number().openapi({
      example: 42,
    }),
  })
  .openapi('User')
```

接下来，创建一个路由：

```ts
import { createRoute } from '@hono/zod-openapi'

const route = createRoute({
  method: 'get',
  path: '/users/{id}',
  request: {
    params: ParamsSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: UserSchema,
        },
      },
      description: '获取用户',
    },
  },
})
```

最后，设置应用程序：

```ts
import { OpenAPIHono } from '@hono/zod-openapi'

const app = new OpenAPIHono()

app.openapi(route, (c) => {
  const { id } = c.req.valid('param')
  return c.json({
    id,
    age: 20,
    name: '超人',
  })
})

// OpenAPI 文档将可在 /doc 访问
app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: '我的 API',
  },
})
```

您可以像使用 Hono 一样启动您的应用程序。对于 Cloudflare Workers 和 Bun，请使用此入口点：

```ts
export default app
```

## 另请参阅

- [Zod OpenAPI Hono](https://github.com/honojs/middleware/tree/main/packages/zod-openapi)