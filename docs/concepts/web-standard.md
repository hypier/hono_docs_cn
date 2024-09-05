# Web Standards

Hono 仅使用 **Web Standards**，如 Fetch。
它们最初用于 `fetch` 函数，并由处理 HTTP 请求和响应的基本对象组成。
除了 `Requests` 和 `Responses`，还有 `URL`、`URLSearchParam`、`Headers` 等。

Cloudflare Workers、Deno 和 Bun 也基于 Web Standards。
例如，返回 "Hello World" 的服务器可以如下编写。这可以在 Cloudflare Workers 和 Bun 上运行。

```ts
export default {
  async fetch() {
    return new Response('Hello World')
  },
}
```

Hono 仅使用 Web Standards，这意味着 Hono 可以在支持它们的任何运行时上运行。
此外，我们还有一个 Node.js 适配器。Hono 在以下运行时上运行：

- Cloudflare Workers (`workerd`)
- Deno
- Bun
- Fastly Compute
- AWS Lambda
- Node.js
- Vercel (edge-light)

它也可以在 Netlify 和其他平台上运行。
相同的代码在所有平台上都能运行。

Cloudflare Workers、Deno、Shopify 等发起了 [WinterCG](https://wintercg.org)，讨论使用 Web Standards 实现“网络互操作性”的可能性。
Hono 将追随他们的步伐，追求 **Web Standards 的标准**。