# 请求 ID 中间件

请求 ID 中间件为每个请求生成一个唯一的 ID，您可以在处理程序中使用它。

## 导入

```ts
import { Hono } from 'hono'
import { requestId } from 'hono/request-id'
```

## 用法

您可以通过在应用了请求 ID 中间件的处理程序和中间件中的 `requestId` 变量访问请求 ID。

```ts
const app = new Hono()

app.use('*', requestId())

app.get('/', (c) => {
  return c.text(`Your request id is ${c.get('requestId')}`)
})
```

如果您想明确指定类型，请导入 `RequestIdVariables` 并将其传递给 `new Hono()` 的泛型。

```ts
import type { RequestIdVariables } from 'hono/request-id'

const app = new Hono<{
  Variables: RequestIdVariables
}>()
```

## 选项

### <Badge type="info" text="可选" /> limitLength: `number`

请求 ID 的最大长度。默认值为 `255`。

### <Badge type="info" text="optional" /> headerName: `string`

用于请求 ID 的头部名称。默认值为 `X-Request-Id`。

### <Badge type="info" text="可选" /> 生成器: `(c: Context) => string`

请求 ID 生成函数。默认情况下，它使用 `crypto.randomUUID()`。