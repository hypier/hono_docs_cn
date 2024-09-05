# Fastly Compute

[Fastly的Compute](https://www.fastly.com/products/edge-compute) 产品使我们能够构建高规模、全球分布的应用程序，并在Fastly CDN的边缘执行代码。

Hono 也在 Fastly Compute 上工作。

## 1. 安装 CLI

要使用 Fastly Compute，您必须 [创建一个 Fastly 账户](https://www.fastly.com/signup/)，如果您还没有的话。然后，安装 [Fastly CLI](https://github.com/fastly/cli)。

macOS

```sh
brew install fastly/tap/fastly
```

请访问以下链接以获取其他操作系统的信息：

- [计算服务 | Fastly 开发者中心](https://developer.fastly.com/learning/compute/#download-and-install-the-fastly-cli)

## 2. 设置

Fastly Compute 的启动器可用。
使用 "create-hono" 命令开始您的项目。
选择 `fastly` 模板作为本示例。

::: code-group

```sh [npm]
npm create hono@latest my-app
```

```sh [yarn]
yarn create hono my-app
```

```sh [pnpm]
pnpm create hono my-app
```

```sh [bun]
bunx create-hono my-app
```

```sh [deno]
deno run -A npm:create-hono my-app
```

:::

进入 `my-app` 并安装依赖。

::: code-group

```sh [npm]
cd my-app
npm i
```

```sh [yarn]
cd my-app
yarn
```

```sh [pnpm]
cd my-app
pnpm i
```

```sh [bun]
cd my-app
bun i
```

:::

## 3. 你好，世界

编辑 `src/index.ts`：

```ts
// src/index.ts
import { Hono } from 'hono'
const app = new Hono()

app.get('/', (c) => c.text('Hello Fastly!'))

app.fire()
```

## 4. 运行

在本地运行开发服务器。然后，在您的Web浏览器中访问`http://localhost:7676`。

::: code-group

```sh [npm]
npm run dev
```

```sh [yarn]
yarn dev
```

```sh [pnpm]
pnpm dev
```

```sh [bun]
bun run dev
```

:::

## 4. 部署

::: code-group

```sh [npm]
npm run deploy
```

```sh [yarn]
yarn deploy
```

```sh [pnpm]
pnpm deploy
```

```sh [bun]
bun run deploy
```

:::

就这些！！