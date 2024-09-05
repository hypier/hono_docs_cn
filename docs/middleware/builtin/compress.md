# Compression Middleware

该中间件根据 `Accept-Encoding` 请求头压缩响应体。

::: info
**注意**：在 Cloudflare Workers 和 Deno Deploy 上，响应体会自动压缩，因此不需要使用此中间件。

**Bun**：该中间件使用 `CompressionStream`，但在 bun 中尚不支持。
:::

## 导入

```ts
import { Hono } from 'hono'
import { compress } from 'hono/compress'
```

## 用法

```ts
const app = new Hono()

app.use(compress())
```

## Options

### <Badge type="info" text="可选" /> 编码: `'gzip'` | `'deflate'`

允许响应压缩的压缩方案。可以是 `gzip` 或 `deflate`。如果未定义，则允许两者，并将根据 `Accept-Encoding` 头部使用。 如果未提供此选项，且客户端在 `Accept-Encoding` 头部提供了两者，则优先使用 `gzip`。