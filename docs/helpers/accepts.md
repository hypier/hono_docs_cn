# Accepts Helper

Accepts Helper 帮助处理请求中的 Accept 头。

## 导入

```ts
import { Hono } from 'hono'
import { accepts } from 'hono/accepts'
```

## `accepts()`

`accepts()` 函数查看 Accept 头，例如 Accept-Encoding 和 Accept-Language，并返回适当的值。

```ts
import { accepts } from 'hono/accepts'

app.get('/', (c) => {
  const accept = accepts(c, {
    header: 'Accept-Language',
    supports: ['en', 'ja', 'zh'],
    default: 'en',
  })
  return c.json({ lang: accept })
})
```

### `AcceptHeader` 类型

`AcceptHeader` 类型的定义如下。

```ts
export type AcceptHeader =
  | 'Accept'
  | 'Accept-Charset'
  | 'Accept-Encoding'
  | 'Accept-Language'
  | 'Accept-Patch'
  | 'Accept-Post'
  | 'Accept-Ranges'
```

## Options

### <Badge type="danger" text="必需" /> header: `AcceptHeader`

目标接受头。

### <Badge type="danger" text="required" /> 支持: `string[]`

您应用程序支持的头部值。

### <Badge type="danger" text="required" /> 默认值: `string`

默认值。

### <Badge type="info" text="可选" /> match: `(accepts: Accept[], config: acceptsConfig) => string`

自定义匹配函数。