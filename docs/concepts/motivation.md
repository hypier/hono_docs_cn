# 哲学

在本节中，我们讨论Hono的概念或哲学。

## 动机

起初，我只是想在 Cloudflare Workers 上创建一个 web 应用程序。
但是，市面上没有适合 Cloudflare Workers 的好框架。
于是，我开始构建 Hono。

我认为这是一个学习如何使用 Trie 树构建路由器的好机会。
然后，一个朋友带来了一个超快的路由器，叫做 "RegExpRouter"。
我还有一个朋友创建了基本身份验证中间件。

仅使用 Web 标准 API，我们就可以在 Deno 和 Bun 上使其工作。当人们问“Bun 上有 Express 吗？”时，我们可以回答，“没有，但有 Hono”。
（尽管 Express 现在可以在 Bun 上运行。）

我们还有朋友制作 GraphQL 服务器、Firebase 身份验证和 Sentry 中间件。
此外，我们还有一个 Node.js 适配器。
一个生态系统已经形成。

换句话说，Hono 非常快速，使许多事情成为可能，并且可以在任何地方运行。
我们可以想象 Hono 有可能成为 **Web 标准的标准**。