# 工厂助手

工厂助手提供了用于创建 Hono 组件（如中间件）的有用功能。有时设置适当的 TypeScript 类型很困难，但这个助手可以简化这一过程。

```
function example() {
    console.log("This is a code block.");
}
```

## 导入

```ts
import { Hono } from 'hono'
import { createFactory, createMiddleware } from 'hono/factory'
```

## `createFactory()`

`createFactory()` 将创建一个 Factory 类的实例。

```ts
import { createFactory } from 'hono/factory'

const factory = createFactory()
```

您可以将您的 Env 类型作为泛型传递：

```ts
type Env = {
  Variables: {
    foo: string
  }
}

const factory = createFactory<Env>()
```

## `createMiddleware()`

`createMiddleware()` 是 `factory.createMiddleware()` 的快捷方式。
此函数将创建您自定义的中间件。

```ts
const messageMiddleware = createMiddleware(async (c, next) => {
  await next()
  c.res.headers.set('X-Message', 'Good morning!')
})
```

提示：如果您想获取像 `message` 这样的参数，可以像下面这样将其创建为一个函数。

```ts
const messageMiddleware = (message: string) => {
  return createMiddleware(async (c, next) => {
    await next()
    c.res.headers.set('X-Message', message)
  })
}

app.use(messageMiddleware('Good evening!'))
```

## `factory.createHandlers()`

`createHandlers()` 有助于在与 `app.get('/')` 不同的地方定义处理程序。

```ts
import { createFactory } from 'hono/factory'
import { logger } from 'hono/logger'

// ...

const factory = createFactory()

const middleware = factory.createMiddleware(async (c, next) => {
  c.set('foo', 'bar')
  await next()
})

const handlers = factory.createHandlers(logger(), middleware, (c) => {
  return c.json(c.var.foo)
})

app.get('/api', ...handlers)
```

## `factory.createApp()` <Badge style="vertical-align: middle;" type="warning" text="实验性" />

`createApp()` 用于创建具有适当类型的 Hono 实例。如果您使用此方法与 `createFactory()`，可以避免在 `Env` 类型的定义中出现冗余。

如果您的应用程序像这样，您必须在两个地方设置 `Env`：

```ts
import { createMiddleware } from 'hono/factory'

type Env = {
  Variables: {
    myVar: string
  }
}

// 1. 将 `Env` 设置为 `new Hono()`
const app = new Hono<Env>()

// 2. 将 `Env` 设置为 `createMiddleware()`
const mw = createMiddleware<Env>(async (c, next) => {
  await next()
})

app.use(mw)
```

通过使用 `createFactory()` 和 `createApp()`，您可以仅在一个地方设置 `Env`。

```ts
import { createFactory } from 'hono/factory'

// ...

// 将 `Env` 设置为 `createFactory()`
const factory = createFactory<Env>()

const app = factory.createApp()

// factory 还具有 `createMiddleware()`
const mw = factory.createMiddleware(async (c, next) => {
  await next()
})
```

`createFactory()` 可以接收 `initApp` 选项来初始化由 `createApp()` 创建的 `app`。以下是使用该选项的示例。

```ts
// factory-with-db.ts
type Env = {
  Bindings: {
    MY_DB: D1Database
  }
  Variables: {
    db: DrizzleD1Database
  }
}

export default createFactory<Env>({
  initApp: (app) => {
    app.use(async (c, next) => {
      const db = drizzle(c.env.MY_DB)
      c.set('db', db)
      await next()
    })
  },
})
```

```ts
// crud.ts
import factoryWithDB from './factory-with-db'

const app = factoryWithDB.createApp()

app.post('/posts', (c) => {
  c.var.db.insert()
  // ...
})
```