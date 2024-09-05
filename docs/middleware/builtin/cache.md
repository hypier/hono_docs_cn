# 缓存中间件

缓存中间件使用Web标准的[缓存API](https://developer.mozilla.org/en-US/docs/Web/API/Cache)。

缓存中间件目前支持使用自定义域的Cloudflare Workers项目和使用[Deno 1.26+](https://github.com/denoland/deno/releases/tag/v1.26.0)的Deno项目。Deno Deploy也可用。

Cloudflare Workers尊重`Cache-Control`头并返回缓存的响应。有关详细信息，请参阅[Cloudflare文档中的缓存](https://developers.cloudflare.com/workers/runtime-apis/cache/)。Deno不尊重头，因此如果您需要更新缓存，您需要实现自己的机制。

请参见下面的[使用说明](#usage)以获取各个平台的指令。

## 导入

```ts
import { Hono } from 'hono'
import { cache } from 'hono/cache'
```

## 使用

::: code-group

```ts [Cloudflare Workers]
app.get(
  '*',
  cache({
    cacheName: 'my-app',
    cacheControl: 'max-age=3600',
  })
)
```

```ts [Deno]
// 必须在 Deno 运行时使用 `wait: true`
app.get(
  '*',
  cache({
    cacheName: 'my-app',
    cacheControl: 'max-age=3600',
    wait: true,
  })
)
```

:::

## Options

### <Badge type="danger" text="required" /> cacheName: `string` | `(c: Context) => string` | `Promise<string>`

缓存的名称。可以用于存储具有不同标识符的多个缓存。

### <Badge type="info" text="可选" /> wait: `boolean`

一个布尔值，指示 Hono 是否应该在继续请求之前等待 `cache.put` 函数的 Promise 解析。_在 Deno 环境中，必须为 true_。默认值为 `false`。

### <Badge type="info" text="可选" /> cacheControl: `string`

`Cache-Control`头部的指令字符串。有关更多信息，请参阅[MDN文档](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)。当未提供此选项时，请求中不会添加`Cache-Control`头部。

### <Badge type="info" text="可选" /> vary: `string` | `string[]`

设置响应中的 `Vary` 头。如果原始响应头已经包含 `Vary` 头，值将被合并，删除任何重复项。将其设置为 `*` 将导致错误。有关 Vary 头及其对缓存策略影响的更多详细信息，请参阅 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary)。

### <Badge type="info" text="可选" /> keyGenerator: `(c: Context) => string | Promise<string>`

为 `cacheName` 存储中的每个请求生成键。这可以根据请求参数或上下文参数缓存数据。默认值为 `c.req.url`。