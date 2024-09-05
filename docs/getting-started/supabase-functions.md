# Supabase Edge Functions

[Supabase](https://supabase.com/) 是一个开源的 Firebase 替代品，提供一套类似于 Firebase 功能的工具，包括数据库、身份验证、存储，现在还支持无服务器函数。

Supabase Edge Functions 是分布在全球的服务器端 TypeScript 函数，运行在离用户更近的地方，以提高性能。这些函数是使用 [Deno](https://deno.com/) 开发的，带来了多个好处，包括增强的安全性和现代的 JavaScript/TypeScript 运行时。

以下是如何开始使用 Supabase Edge Functions 的步骤：

## 1. 设置

### 前提条件

在开始之前，请确保您已安装 Supabase CLI。如果尚未安装，请按照[官方文档](https://supabase.com/docs/guides/cli/getting-started)中的说明进行操作。

### 创建新项目

1. 打开您的终端或命令提示符。

2. 通过运行以下命令在本地机器的目录中创建一个新的 Supabase 项目：

```bash
supabase init

```

此命令在当前目录中初始化一个新的 Supabase 项目。

### 添加边缘函数

3. 在您的 Supabase 项目中，创建一个名为 `hello-world` 的新边缘函数：

```bash
supabase functions new hello-world

```

此命令将在您的项目中创建一个具有指定名称的新边缘函数。

## 2. Hello World

编辑 `supabase/functions/hello-world/index.ts` 文件中的 `hello-world` 函数：

```ts
import { Hono } from 'jsr:@hono/hono'

// change this to your function name
const functionName = 'hello-world'
const app = new Hono().basePath(`/${functionName}`)

app.get('/hello', (c) => c.text('Hello from hono-server!'))

Deno.serve(app.fetch)
```

## 3. 运行

要在本地运行该函数，请使用以下命令：

1. 使用以下命令来启动函数：

```bash
supabase start # start the supabase stack
supabase functions serve --no-verify-jwt # start the Functions watcher
```

`--no-verify-jwt` 标志允许您在本地开发期间跳过 JWT 验证。

2. 使用 cURL 或 Postman 向 `http://127.0.0.1:54321/functions/v1/hello-world/hello` 发起 GET 请求：

```bash
curl  --location  'http://127.0.0.1:54321/functions/v1/hello-world/hello'
```

该请求应返回文本 "Hello from hono-server!"。

## 4. 部署

您可以通过单个命令在 Supabase 中部署所有的 Edge Functions：

```bash
supabase functions deploy
```

或者，您可以通过在部署命令中指定函数的名称来部署单个 Edge Functions：

```bash
supabase functions deploy hello-world

```

有关更多部署方法，请访问 Supabase 文档中的 [部署到生产](https://supabase.com/docs/guides/functions/deploy)。