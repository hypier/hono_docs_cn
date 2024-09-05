---
title: Hono - 边缘的超快速网页框架
titleTemplate: ':title'
---

# Hono

Hono - _**在日语中意为火焰🔥**_ - 是一个基于Web标准的小型、简单且超快速的Web框架。它可以在任何JavaScript运行时上运行：Cloudflare Workers、Fastly Compute、Deno、Bun、Vercel、Netlify、AWS Lambda、Lambda@Edge和Node.js。

快速，但不仅仅是快速。

```ts
import { Hono } from 'hono'
const app = new Hono()

app.get('/', (c) => c.text('Hono!'))

export default app
```

## 快速开始

只需运行以下命令：

::: code-group

```sh [npm]
npm create hono@latest
```

```sh [yarn]
yarn create hono
```

```sh [pnpm]
pnpm create hono@latest
```

```sh [bun]
bun create hono@latest
```

```sh [deno]
deno run -A npm:create-hono@latest
```

:::

## 特性

- **超快** 🚀 - 路由器 `RegExpRouter` 非常快速。没有使用线性循环。快速。
- **轻量级** 🪶 - `hono/tiny` 预设小于 14kB。Hono 没有任何依赖，仅使用 Web 标准。
- **多运行时** 🌍 - 可在 Cloudflare Workers、Fastly Compute、Deno、Bun、AWS Lambda 或 Node.js 上运行。相同的代码可以在所有平台上运行。
- **内置功能** 🔋 - Hono 具有内置中间件、自定义中间件、第三方中间件和助手。内置功能。
- **愉悦的开发体验** 😃 - 超干净的 API。一级 TypeScript 支持。现在，我们有了“类型”。

## 用例

Hono 是一个简单的 web 应用框架，类似于 Express，但没有前端。
它运行在 CDN 边缘，并允许您在与中间件结合时构建更大的应用程序。
以下是一些用例示例。

- 构建 Web API
- 后端服务器的代理
- CDN 前端
- 边缘应用
- 库的基础服务器
- 全栈应用

## 谁在使用 Hono？

| 项目                                                                | 平台               | 用途                                                                                     |
| ------------------------------------------------------------------ | ------------------ | --------------------------------------------------------------------------------------- |
| [cdnjs](https://cdnjs.com)                                         | Cloudflare Workers | 一个免费的开源 CDN 服务。_Hono 用于 API 服务器。                                        |
| [Cloudflare D1](https://www.cloudflare.com/developer-platform/d1/) | Cloudflare Workers | 无服务器 SQL 数据库。_Hono 用于内部 API 服务器。                                       |
| [Unkey](https://unkey.dev)                                         | Cloudflare Workers | 一个开源的 API 身份验证和授权。_Hono 用于 API 服务器。                                 |
| [OpenStatus](https://openstatus.dev)                               | Bun                | 一个开源的网站和 API 监控平台。_Hono 用于 API 服务器。                                 |
| [Deno Benchmarks](https://deno.com/benchmarks)                     | Deno               | 一个基于 V8 的安全 TypeScript 运行时。_Hono 用于基准测试。                             |

还有以下内容。

- [Drivly](https://driv.ly/) - Cloudflare Workers
- [repeat.dev](https://repeat.dev/) - Cloudflare Workers

想要查看更多内容吗？请查看 [谁在生产中使用 Hono？](https://github.com/orgs/honojs/discussions/1510)。

## Hono 一分钟入门

一个演示，展示如何使用 Hono 创建 Cloudflare Workers 应用程序。

![Demo](/images/sc.gif)

## 超快速

**Hono 是最快的**，与其他 Cloudflare Workers 路由器相比。

```
Hono x 402,820 ops/sec ±4.78% (80 runs sampled)
itty-router x 212,598 ops/sec ±3.11% (87 runs sampled)
sunder x 297,036 ops/sec ±4.76% (77 runs sampled)
worktop x 197,345 ops/sec ±2.40% (88 runs sampled)
Fastest is Hono
✨  Done in 28.06s.
```

查看 [更多基准测试](/docs/concepts/benchmarks)。

## 轻量级

**Hono 非常小**。使用 `hono/tiny` 预设时，其大小在压缩后**小于 14KB**。有许多中间件和适配器，但只有在使用时才会打包。作为对比，Express 的大小为 572KB。

```
$ npx wrangler dev --minify ./src/index.ts
 ⛅️ wrangler 2.20.0
--------------------
⬣ Listening at http://0.0.0.0:8787
- http://127.0.0.1:8787
- http://192.168.128.165:8787
Total Upload: 11.47 KiB / gzip: 4.34 KiB
```

## 多个路由器

**Hono 有多个路由器**。

**RegExpRouter** 是 JavaScript 世界中最快的路由器。它使用在分发之前创建的单个大型正则表达式来匹配路由。使用 **SmartRouter**，它支持所有路由模式。

**LinearRouter** 非常快速地注册路由，因此适合每次初始化应用程序的环境。**PatternRouter** 简单地添加并匹配模式，使其体积小巧。

查看 [有关路由的更多信息](/docs/concepts/routers)。

## 网络标准

感谢使用**网络标准**，Hono 可以在许多平台上运行。

- Cloudflare Workers
- Cloudflare Pages
- Fastly Compute
- Deno
- Bun
- Vercel
- AWS Lambda
- Lambda@Edge
- 其他

通过使用 [Node.js 适配器](https://github.com/honojs/node-server)，Hono 可以在 Node.js 上运行。

请查看 [有关网络标准的更多信息](/docs/concepts/web-standard)。

## 中间件与助手

**Hono 有许多中间件和助手**。这些使得“少写代码，多做事”成为现实。

开箱即用，Hono 提供以下中间件和助手：

- [基本认证](/docs/middleware/builtin/basic-auth)
- [承载认证](/docs/middleware/builtin/bearer-auth)
- [请求体限制](/docs/middleware/builtin/body-limit)
- [缓存](/docs/middleware/builtin/cache)
- [压缩](/docs/middleware/builtin/compress)
- [Cookie](/docs/helpers/cookie)
- [CORS](/docs/middleware/builtin/cors)
- [ETag](/docs/middleware/builtin/etag)
- [html](/docs/helpers/html)
- [JSX](/docs/guides/jsx)
- [JWT 认证](/docs/middleware/builtin/jwt)
- [日志记录](/docs/middleware/builtin/logger)
- [美化 JSON](/docs/middleware/builtin/pretty-json)
- [安全头部](/docs/middleware/builtin/secure-headers)
- [静态生成](/docs/helpers/ssg)
- [流式处理](/docs/helpers/streaming)
- [GraphQL 服务器](https://github.com/honojs/middleware/tree/main/packages/graphql-server)
- [Firebase 认证](https://github.com/honojs/middleware/tree/main/packages/firebase-auth)
- [Sentry](https://github.com/honojs/middleware/tree/main/packages/sentry)
- 其他！

例如，使用 Hono 添加 ETag 和请求日志记录只需几行代码：

```ts
import { Hono } from 'hono'
import { etag } from 'hono/etag'
import { logger } from 'hono/logger'

const app = new Hono()
app.use(etag(), logger())
```

查看 [有关中间件的更多信息](/docs/concepts/middleware)。

## 开发者体验

Hono 提供了令人愉悦的 "**开发者体验**"。

得益于 `Context` 对象，轻松访问请求/响应。
此外，Hono 是用 TypeScript 编写的。Hono 有 "**类型**"。

例如，路径参数将是字面量类型。

![SS](/images/ss.png)

而且，Validator 和 Hono Client `hc` 使 RPC 模式成为可能。在 RPC 模式下，
您可以使用您喜欢的验证器，如 Zod，并轻松地与客户端共享服务器端 API 规范，从而构建类型安全的应用程序。

请参阅 [Hono Stacks](/docs/concepts/stacks)。