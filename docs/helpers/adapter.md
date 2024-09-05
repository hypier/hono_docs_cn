# 适配器助手

适配器助手通过统一的接口提供与各种平台无缝交互的方式。

## 导入

```ts
import { Hono } from 'hono'
import { env, getRuntimeKey } from 'hono/adapter'
```

## `env()`

`env()` 函数用于在不同的运行时中检索环境变量，超出了 Cloudflare Workers 的 Bindings。通过 `env(c)` 可以检索到的值在每个运行时中可能不同。

```ts
import { env } from 'hono/adapter'

app.get('/env', (c) => {
  // NAME 在 Node.js 或 Bun 中是 process.env.NAME
  // NAME 在 Cloudflare 中是 `wrangler.toml` 中写入的值
  const { NAME } = env<{ NAME: string }>(c)
  return c.text(NAME)
})
```

支持的运行时、无服务器平台和云服务：

- Cloudflare Workers
  - `wrangler.toml`
- Deno
  - [`Deno.env`](https://docs.deno.com/runtime/manual/basics/env_variables)
  - `.env` 文件
- Bun
  - [`Bun.env`](https://bun.sh/guides/runtime/set-env)
  - `process.env`
- Node.js
  - `process.env`
- Vercel
  - [Vercel 上的环境变量](https://vercel.com/docs/projects/environment-variables)
- AWS Lambda
  - [AWS Lambda 上的环境变量](https://docs.aws.amazon.com/lambda/latest/dg/samples-blank.html#samples-blank-architecture)
- Lambda@Edge\
  Lambda 上的环境变量在 [Lambda@Edge 中不支持](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/add-origin-custom-headers.html)，您需要使用 [Lamdba@Edge 事件](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-event-structure.html) 作为替代。
- Fastly Compute\
  在 Fastly Compute 上，您可以使用 ConfigStore 来管理用户定义的数据。
- Netlify\
  在 Netlify 上，您可以使用 [Netlify 上下文](https://docs.netlify.com/site-deploys/overview/#deploy-contexts) 来管理用户定义的数据。

### 指定运行时

您可以通过将运行时键作为第二个参数传递来指定运行时以获取环境变量。

```ts
app.get('/env', (c) => {
  const { NAME } = env<{ NAME: string }>(c, 'workerd')
  return c.text(NAME)
})
```

## `getRuntimeKey()`

`getRuntimeKey()` 函数返回当前运行时的标识符。

```ts
app.get('/', (c) => {
  if (getRuntimeKey() === 'workerd') {
    return c.text('You are on Cloudflare')
  } else if (getRuntimeKey() === 'bun') {
    return c.text('You are on Bun')
  }
  ...
})
```

### 可用的运行时键

以下是可用的运行时键，不可用的运行时键可能会被支持并标记为 `other`，其中一些受到 [WinterCG 的运行时键](https://runtime-keys.proposal.wintercg.org/) 的启发：

- `workerd` - Cloudflare Workers
- `deno`
- `bun`
- `node`
- `edge-light` - Vercel Edge Functions
- `fastly` - Fastly Compute
- `other` - 其他未知的运行时键