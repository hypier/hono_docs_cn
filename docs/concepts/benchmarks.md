# Benchmark

基准只是基准，但对我们来说很重要。

## 路由器

我们测量了一些 JavaScript 路由器的速度。
例如，`find-my-way` 是一个在 Fastify 内部使用的非常快速的路由器。

- @medley/router
- find-my-way
- koa-tree-router
- trek-router
- express (包括处理)
- koa-router

首先，我们为每个路由器注册了以下路由。
这些与现实世界中使用的路由相似。

```ts
export const routes: Route[] = [
  { method: 'GET', path: '/user' },
  { method: 'GET', path: '/user/comments' },
  { method: 'GET', path: '/user/avatar' },
  { method: 'GET', path: '/user/lookup/username/:username' },
  { method: 'GET', path: '/user/lookup/email/:address' },
  { method: 'GET', path: '/event/:id' },
  { method: 'GET', path: '/event/:id/comments' },
  { method: 'POST', path: '/event/:id/comment' },
  { method: 'GET', path: '/map/:location/events' },
  { method: 'GET', path: '/status' },
  { method: 'GET', path: '/very/deeply/nested/route/hello/there' },
  { method: 'GET', path: '/static/*' },
]
```

然后我们像下面这样向端点发送请求。

```ts
const routes: (Route & { name: string })[] = [
  {
    name: '短静态',
    method: 'GET',
    path: '/user',
  },
  {
    name: '同基数静态',
    method: 'GET',
    path: '/user/comments',
  },
  {
    name: '动态路由',
    method: 'GET',
    path: '/user/lookup/username/hey',
  },
  {
    name: '混合静态动态',
    method: 'GET',
    path: '/event/abcd1234/comments',
  },
  {
    name: 'POST',
    method: 'POST',
    path: '/event/abcd1234/comment',
  },
  {
    name: '长静态',
    method: 'GET',
    path: '/very/deeply/nested/route/hello/there',
  },
  {
    name: '通配符',
    method: 'GET',
    path: '/static/index.html',
  },
]
```

让我们看看结果。

### On Node.js

以下截图显示了在 Node.js 上的结果。

![bench](/images/bench01.png)

![bench](/images/bench02.png)

![bench](/images/bench03.png)

![bench](/images/bench04.png)

![bench](/images/bench05.png)

![bench](/images/bench06.png)

![bench](/images/bench07.png)

![bench](/images/bench08.png)

### On Bun

以下截图显示了在 Bun 上的结果。

![bench](/images/bench09.png)

![bench](/images/bench10.png)

![bench](/images/bench11.png)

![bench](/images/bench12.png)

![bench](/images/bench13.png)

![bench](/images/bench14.png)

![bench](/images/bench15.png)

![bench](/images/bench16.png)

## Cloudflare Workers

**Hono 是最快的**，与其他 Cloudflare Workers 路由器相比。

- 机器：Apple MacBook Pro，32 GiB，M1 Pro
- 脚本：[benchmarks/handle-event](https://github.com/honojs/hono/tree/main/benchmarks/handle-event)

```
Hono x 402,820 ops/sec ±4.78% (80 runs sampled)
itty-router x 212,598 ops/sec ±3.11% (87 runs sampled)
sunder x 297,036 ops/sec ±4.76% (77 runs sampled)
worktop x 197,345 ops/sec ±2.40% (88 runs sampled)
Fastest is Hono
✨  Done in 28.06s.
```

## Deno

**Hono 是最快的**，与其他 Deno 框架相比。

- 机器：Apple MacBook Pro, 32 GiB, M1 Pro, Deno v1.22.0
- 脚本：[benchmarks/deno](https://github.com/honojs/hono/tree/main/benchmarks/deno)
- 方法：`bombardier --fasthttp -d 10s -c 100 'http://localhost:8000/user/lookup/username/foo'`

| 框架      |   版本      |                  结果 |
| --------- | :----------: | ---------------------: |
| **Hono**  |    3.0.0    | **每秒请求数：136112** |
| Fast      | 4.0.0-beta.1 |     每秒请求数：103214 |
| Megalo    |    0.3.0    |      每秒请求数：64597 |
| Faster    |     5.7      |      每秒请求数：54801 |
| oak       |    10.5.1   |      每秒请求数：43326 |
| opine     |    2.2.0    |      每秒请求数：30700 |

另一个基准测试结果：[denosaurs/bench](https://github.com/denosaurs/bench)

## Bun

Hono 是 Bun 中最快的框架之一。  
您可以在下面查看。

- [SaltyAom/bun-http-framework-benchmark](https://github.com/SaltyAom/bun-http-framework-benchmark)