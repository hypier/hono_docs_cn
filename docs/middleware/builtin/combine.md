# 合并中间件

合并中间件将多个中间件函数组合成一个单一的中间件。它提供三个函数：

- `some` - 仅运行给定中间件中的一个。
- `every` - 运行所有给定中间件。
- `except` - 仅在不满足条件的情况下运行所有给定中间件。

```
function mergeMiddleware(...middlewares) {
  return (req, res, next) => {
    // Middleware logic here
  };
}
```

## 导入

```ts
import { Hono } from 'hono'
import { some, every, except } from 'hono/combine'
```

## 使用方法

这是一个使用 Combine Middleware 的复杂访问控制规则示例。

```ts
import { Hono } from 'hono'
import { bearerAuth } from 'hono/bearer-auth'
import { getConnInfo } from 'hono/cloudflare-workers'
import { every, some } from 'hono/combine'
import { ipRestriction } from 'hono/ip-restriction'
import { rateLimit } from '@/my-rate-limit'

const app = new Hono()

app.use(
  '*',
  some(
    every(
      ipRestriction(getConnInfo, { allowList: ['192.168.0.2'] }),
      bearerAuth({ token })
    ),
    // 如果两个条件都满足，rateLimit 将不会执行。
    rateLimit()
  )
)

app.get('/', (c) => c.text('Hello Hono!'))
```

### some

运行第一个返回 true 的中间件。中间件按顺序应用，如果任何中间件成功退出，则后续中间件将不会运行。

```ts
import { some } from 'combine'
import { bearerAuth } from 'bearer-auth'
import { myRateLimit } from '@/rate-limit'

// If client has a valid token, skip rate limiting.
// Otherwise, apply rate limiting.
app.use(
  '/api/*',
  some(bearerAuth({ token }), myRateLimit({ limit: 100 }))
)
```

### every

运行所有中间件，如果其中任何一个失败则停止。中间件按顺序应用，如果任何中间件抛出错误，则后续中间件将不会运行。

```ts
import { some, every } from 'hono/combine'
import { bearerAuth } from 'hono/bearer-auth'
import { myCheckLocalNetwork } from '@/check-local-network'
import { myRateLimit } from '@/rate-limit'

// If client is in local network, skip authentication and rate limiting.
// Otherwise, apply authentication and rate limiting.
app.use(
  '/api/*',
  some(
    myCheckLocalNetwork(),
    every(bearerAuth({ token }), myRateLimit({ limit: 100 }))
  )
)
```

### except

运行所有中间件，除非满足条件。您可以将字符串或函数作为条件传递。如果需要匹配多个目标，请将它们作为数组传递。

```ts
import { except } from 'hono/combine'
import { bearerAuth } from 'hono/bearer-auth'

// If client is accessing public API, skip authentication.
// Otherwise, require a valid token.
app.use('/api/*', except('/api/public/*', bearerAuth({ token })))
```