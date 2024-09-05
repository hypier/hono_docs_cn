# Pylon

::: warning
**Pylon 需要 Bun：** 该项目目前依赖于 [Bun 运行时](https://bun.sh)。如果您需要支持其他运行时，请在问题 https://github.com/getcronit/pylon/issues/6 上投票并关注讨论，以帮助我们优先考虑此问题。
:::

使用 Pylon 构建 GraphQL API 简单明了。Pylon 是一个基于 Hono 构建的后端框架，提供代码优先的 GraphQL API 开发。

GraphQL 架构实时从您的 TypeScript 定义中生成，使您能够专注于编写服务逻辑。这种方法显著提高了开发速度，增强了类型安全性，并减少了错误。

您代码中的任何破坏性更改会立即反映在您的 API 中，使您能够立即看到更改如何影响其功能。

## 设置新的 Pylon 服务

### 设置 Pylon

您需要按照 [他们的文档](https://pylon.cronit.io/docs/installation) 中的说明安装 Pylon。

### 创建新项目

要创建一个新的 Pylon 项目，请运行以下命令：

```bash
pylon new my-pylon-project
```

这将创建一个名为 `my-pylon-project` 的新目录，包含基本的 Pylon 项目结构。

### 项目结构

Pylon 项目的结构如下：

```
my-pylon-project/
├── .pylon/
├── src/
│   ├── index.ts
├── package.json
├── tsconfig.json
```

- `.pylon/`: 包含您项目的生产构建。
- `src/`: 包含您项目的源代码。
- `src/index.ts`: 您的 Pylon 服务的入口点。
- `package.json`: npm 包配置文件。
- `tsconfig.json`: TypeScript 配置文件。

### 基本示例

这是一个基本的 Pylon 服务示例：

```ts
import { defineService } from '@getcronit/pylon'

export default defineService({
  Query: {
    sum: (a: number, b: number) => a + b,
  },
  Mutation: {
    divide: (a: number, b: number) => a / b,
  },
})
```

## 保护 API

Pylon 与 ZITADEL 集成，ZITADEL 是一个云原生的身份和访问管理解决方案，为您的 API 提供安全的身份验证和授权。您可以通过遵循 [ZITADEL 文档](https://zitadel.com/docs/examples/secure-api/pylon) 中概述的步骤轻松保护您的 Pylon API。

## 创建更复杂的 API

Pylon 允许您通过利用其实时模式生成能力来创建更复杂的 API。有关支持的 TypeScript 类型以及如何定义您的 API 的更多信息，请参阅 [Pylon 文档](https://pylon.cronit.io/docs/core-concepts/type-safety-and-type-integration)

此示例演示了如何在 Pylon 中定义复杂类型和服务。通过利用 TypeScript 类和方法，您可以创建与数据库、外部服务和其他资源交互的强大 API。

```ts
import { defineService } from '@getcronit/pylon'

class Post {
  id: string
  title: string

  constructor(id: string, title: string) {
    this.id = id
    this.title = title
  }
}

class User {
  id: string
  name: string

  constructor(id: string, name: string) {
    this.id = id
    this.name = name
  }

  static async getById(id: string): Promise<User> {
    // Fetch user data from the database
    return new User(id, 'John Doe')
  }

  async posts(): Promise<Post[]> {
    // Fetch posts for this user from the database
    return [new Post('1', 'Hello, world!')]
  }

  async $createPost(title: string, content: string): Promise<Post> {
    // Create a new post for this user in the database
    return new Post('2', title)
  }
}

export default defineService({
  Query: {
    user: User.getById,
  },
  Mutation: {
    createPost: async (userId: string, title: string, content: string) => {
      const user = await User.getById(userId)
      return user.$createPost(title, content)
    },
  },
})
```

## 调用 API

Pylon API 可以使用任何 GraphQL 客户端库进行调用。出于开发目的，建议使用 Pylon Playground，这是一个基于网页的 GraphQL IDE，允许您实时与 API 进行交互。

1. 在您的项目目录中运行 `bun run develop` 启动 Pylon 服务器。
2. 在浏览器中通过访问 `http://localhost:3000/graphql` 打开 Pylon Playground。
3. 在左侧窗格中编写您的 GraphQL 查询或变更。

![Pylon Playground](/images/pylon-example.png)

## 获取 Hono 上下文的访问权限

您可以通过使用 `getContext` 函数在代码中的任何位置访问 Hono 上下文。此函数返回当前上下文对象，该对象包含有关请求、响应和其他上下文特定数据的信息。

```ts
import { defineService, getContext } from '@getcronit/pylon'

export default defineService({
  Query: {
    hello: () => {
      const context = getContext()
      return `Hello, ${context.req.header('user-agent')}`
    },
  },
})
```

有关 Hono 上下文对象及其属性的更多信息，请参阅 [Hono 文档](https://hono.dev/docs/api/context) 和 [Pylon 文档](https://pylon.cronit.io/docs/core-concepts/context-management)。

## Hono 在哪里适用？

Pylon 是建立在 Hono 之上的一个轻量级网络框架，用于构建网络应用程序和 API。Hono 提供了处理 HTTP 请求和响应的核心功能，而 Pylon 扩展了这些功能以支持 GraphQL API 的开发。

除了 GraphQL，您还可以构建路由和中间件。通过使用 `configureApp` 导出，可以访问底层的 Hono 应用实例并添加路由和中间件。

```ts
import { defineService, PylonAPI } from '@getcronit/pylon'

export default defineService({
  Query: {
    sum: (a: number, b: number) => a + b,
  },
  Mutation: {
    divide: (a: number, b: number) => a / b,
  },
})

export const configureApp: PylonAPI['configureApp'] = (app) => {
  app.get('/hello', (ctx, next) => {
    return new Response('Hello, world!')
  })
}
```

## 结论

Pylon 是一个强大的网络框架，简化了 GraphQL API 的开发。通过利用 TypeScript 类型定义，Pylon 提供实时的模式生成，增强了类型安全性并减少了错误。使用 Pylon，您可以快速构建满足业务需求的安全且可扩展的 API。Pylon 与 Hono 的集成使您能够在专注于 GraphQL API 开发的同时使用 Hono 的所有功能。

有关 Pylon 的更多信息，请查看 [官方文档](https://pylon.cronit.io).

## 另请参见

- [Pylon](https://github.com/getcronit/pylon)
- [Pylon 文档](https://pylon.cronit.io)
- [Hono 文档](https://hono.dev/docs)
- [ZITADEL 文档](https://zitadel.com/docs/examples/secure-api/pylon)