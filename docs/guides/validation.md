# 验证

Hono 仅提供一个非常简单的 Validator。  
但是，当与第三方 Validator 结合使用时，它可以变得强大。  
此外，RPC 功能允许您通过类型与客户共享 API 规格。

## 手动验证器

首先，介绍一种在不使用第三方验证器的情况下验证传入值的方法。

从 `hono/validator` 导入 `validator`。

```ts
import { validator } from 'hono/validator'
```

要验证表单数据，将 `form` 指定为第一个参数，并将回调函数作为第二个参数。在回调函数中，验证值并在最后返回验证后的值。`validator` 可以作为中间件使用。

```ts
app.post(
  '/posts',
  validator('form', (value, c) => {
    const body = value['body']
    if (!body || typeof body !== 'string') {
      return c.text('Invalid!', 400)
    }
    return {
      body: body,
    }
  }),
  //...
```

在处理程序中，可以使用 `c.req.valid('form')` 获取验证后的值。

```ts
, (c) => {
  const { body } = c.req.valid('form')
  // ... do something
  return c.json(
    {
      message: 'Created!',
    },
    201
  )
}
```

验证目标包括 `json`、`query`、`header`、`param` 和 `cookie`，除了 `form`。

## 多个验证器

您还可以包含多个验证器来验证请求的不同部分：

```ts
app.post(
  '/posts/:id',
  validator('param', ...),
  validator('query', ...),
  validator('json', ...),
  (c) => {
    //...
  }
```

## 使用 Zod

您可以使用 [Zod](https://zod.dev)，这是一个第三方验证器。
我们建议使用第三方验证器。

从 Npm 注册表安装。

::: code-group

```sh [npm]
npm i zod
```

```sh [yarn]
yarn add zod
```

```sh [pnpm]
pnpm add zod
```

```sh [bun]
bun add zod
```

:::

从 `zod` 导入 `z`。

```ts
import { z } from 'zod'
```

编写您的模式。

```ts
const schema = z.object({
  body: z.string(),
})
```

您可以在回调函数中使用模式进行验证并返回验证后的值。

```ts
const route = app.post(
  '/posts',
  validator('form', (value, c) => {
    const parsed = schema.safeParse(value)
    if (!parsed.success) {
      return c.text('Invalid!', 401)
    }
    return parsed.data
  }),
  (c) => {
    const { body } = c.req.valid('form')
    // ... do something
    return c.json(
      {
        message: 'Created!',
      },
      201
    )
  }
)
```

## Zod 验证器中间件

您可以使用 [Zod 验证器中间件](https://github.com/honojs/middleware/tree/main/packages/zod-validator) 来简化操作。

::: code-group

```sh [npm]
npm i @hono/zod-validator
```

```sh [yarn]
yarn add @hono/zod-validator
```

```sh [pnpm]
pnpm add @hono/zod-validator
```

```sh [bun]
bun add @hono/zod-validator
```

:::

并导入 `zValidator`。

```ts
import { zValidator } from '@hono/zod-validator'
```

并按如下方式编写。

```ts
const route = app.post(
  '/posts',
  zValidator(
    'form',
    z.object({
      body: z.string(),
    })
  ),
  (c) => {
    const validated = c.req.valid('form')
    // ... 使用您的验证数据
  }
)
```