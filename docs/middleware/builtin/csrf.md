# CSRF 保护

CSRF 保护中间件通过检查请求头来防止 CSRF 攻击。

该中间件通过将 `Origin` 头的值与请求的 URL 进行比较，来保护免受诸如通过表单元素提交的 CSRF 攻击。

不发送 `Origin` 头的旧浏览器，或使用反向代理来移除 `Origin` 头的环境，可能无法正常工作。在这种环境中，请使用其他 CSRF 令牌方法。

## 导入

```ts
import { Hono } from 'hono'
import { csrf } from 'hono/csrf'
```

## 用法

```ts
const app = new Hono()

app.use(csrf())

// 使用 `origin` 选项指定来源
// string
app.use(csrf({ origin: 'myapp.example.com' }))

// string[]
app.use(
  csrf({
    origin: ['myapp.example.com', 'development.myapp.example.com'],
  })
)

// 函数
// 强烈建议验证协议以确保与 `$` 匹配。
// 你*绝不*应该进行前向匹配。
app.use(
  '*',
  csrf({
    origin: (origin) =>
      /https:\/\/(\w+\.)?myapp\.example\.com$/.test(origin),
  })
)
```

## Options

### <Badge type="info" text="可选" /> origin: `string` | `string[]` | `Function`

指定来源。