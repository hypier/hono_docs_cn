# IP 限制中间件

IP 限制中间件是一种根据用户的 IP 地址限制对资源访问的中间件。

## 导入

```ts
import { Hono } from 'hono'
import { ipRestriction } from 'hono/ip-restriction'
```

## 使用

对于在 Bun 上运行的应用程序，如果您想仅允许来自本地的访问，可以按如下方式编写。指定您想要拒绝的规则在 `denyList` 中，您想要允许的规则在 `allowList` 中。

```ts
import { Hono } from 'hono'
import { getConnInfo } from 'hono/bun'
import { ipRestriction } from 'hono/ip-restriction'

const app = new Hono()

app.use(
  '*',
  ipRestriction(getConnInfo, {
    denyList: [],
    allowList: ['127.0.0.1', '::1'],
  })
)

app.get('/', (c) => c.text('Hello Hono!'))
```

将适合您环境的 [ConnInfo helper](/docs/helpers/conninfo) 中的 `getConninfo` 作为 `ipRestriction` 的第一个参数传递。例如，对于 Deno，它看起来像这样：

```ts
import { getConnInfo } from 'hono/deno'
import { ipRestriction } from 'hono/ip-restriction'

//...

app.use(
  '*',
  ipRestriction(getConnInfo, {
    // ...
  })
)
```

## 规则

遵循以下指示来编写规则。

### IPv4

- `192.168.2.0` - 静态IP地址
- `192.168.2.0/24` - CIDR表示法
- `*` - 所有地址

### IPv6

- `::1` - 静态IP地址
- `::1/10` - CIDR表示法
- `*` - 所有地址

## 错误处理

要自定义错误，请在第三个参数中返回一个 `Response`。

```ts
app.use(
  '*',
  ipRestriction(
    getConnInfo,
    {
      denyList: ['192.168.2.0/24'],
    },
    async (remote, c) => {
      return c.text(`Blocking access from ${remote.addr}`, 403)
    }
  )
)
```