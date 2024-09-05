# Swagger UI

[Swagger UI Middleware](https://github.com/honojs/middleware/tree/main/packages/swagger-ui) 提供了一个中间件和一个组件，用于将 [Swagger UI](https://swagger.io/docs/open-source-tools/swagger-ui/usage/installation/) 集成到 Hono 应用程序中。

```ts
import { Hono } from 'hono'
import { swaggerUI } from '@hono/swagger-ui'

const app = new Hono()

// Use the middleware to serve Swagger UI at /ui
app.get('/ui', swaggerUI({ url: '/doc' }))

export default app
```

## 另见

- [Swagger UI 中间件](https://github.com/honojs/middleware/tree/main/packages/swagger-ui)