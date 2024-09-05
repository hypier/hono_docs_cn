# Azure Functions

[Azure Functions](https://azure.microsoft.com/en-us/products/functions) 是来自 Microsoft Azure 的无服务器平台。您可以根据事件运行代码，它会自动为您管理底层计算资源。

Hono 最初并不是为 Azure Functions 设计的。但通过 [Azure Functions Adapter](https://github.com/Marplex/hono-azurefunc-adapter)，它也可以在上面运行。

它与运行在 Node.js 18 或更高版本上的 Azure Functions **V4** 一起工作。

## 1. 安装 CLI

要创建 Azure Function，您必须首先安装 [Azure Functions Core Tools](https://learn.microsoft.com/en-us/azure/azure-functions/create-first-function-cli-typescript?pivots=nodejs-model-v4#install-the-azure-functions-core-tools)。

在 macOS 上

```sh
brew tap azure/functions
brew install azure-functions-core-tools@4
```

有关其他操作系统，请访问以下链接：

- [安装 Azure Functions Core Tools | Microsoft Learn](https://learn.microsoft.com/en-us/azure/azure-functions/create-first-function-cli-typescript?pivots=nodejs-model-v4#install-the-azure-functions-core-tools)

## 2. 设置

在当前文件夹中创建一个 TypeScript Node.js V4 项目。

```sh
func init --typescript
```

更改主机的默认路由前缀。将此属性添加到 `host.json` 的根 json 对象中：

```json
"extensions": {
    "http": {
        "routePrefix": ""
    }
}
```

::: info
默认的 Azure Functions 路由前缀是 `/api`。如果您不按上述方式更改它，请确保所有 Hono 路由都以 `/api` 开头。
:::

现在您可以使用以下命令安装 Hono 和 Azure Functions 适配器：

::: code-group

```sh [npm]
npm i @marplex/hono-azurefunc-adapter hono
```

```sh [yarn]
yarn add @marplex/hono-azurefunc-adapter hono
```

```sh [pnpm]
pnpm add @marplex/hono-azurefunc-adapter hono
```

```sh [bun]
bun add @marplex/hono-azurefunc-adapter hono
```

:::

## 3. Hello World

创建 `src/app.ts`:

```ts
// src/app.ts
import { Hono } from 'hono'
const app = new Hono()

app.get('/', (c) => c.text('Hello Azure Functions!'))

export default app
```

创建 `src/functions/httpTrigger.ts`:

```ts
// src/functions/httpTrigger.ts
import { app } from '@azure/functions'
import { azureHonoHandler } from '@marplex/hono-azurefunc-adapter'
import honoApp from '../app'

app.http('httpTrigger', {
  methods: [
    //在此添加所有支持的 HTTP 方法
    'GET',
    'POST',
    'DELETE',
    'PUT',
  ],
  authLevel: 'anonymous',
  route: '{*proxy}',
  handler: azureHonoHandler(honoApp.fetch),
})
```

## 4. 运行

在本地运行开发服务器。然后，在您的Web浏览器中访问 `http://localhost:7071`。

::: code-group

```sh [npm]
npm run start
```

```sh [yarn]
yarn start
```

```sh [pnpm]
pnpm start
```

```sh [bun]
bun run start
```

:::

## 5. 部署

::: info
在您可以部署到 Azure 之前，您需要在您的云基础设施中创建一些资源。请访问 Microsoft 文档，了解 [为您的函数创建支持的 Azure 资源](https://learn.microsoft.com/en-us/azure/azure-functions/create-first-function-cli-typescript?pivots=nodejs-model-v4&tabs=windows%2Cazure-cli%2Cbrowser#create-supporting-azure-resources-for-your-function)
:::

构建项目以进行部署：

::: code-group

```sh [npm]
npm run build
```

```sh [yarn]
yarn build
```

```sh [pnpm]
pnpm build
```

```sh [bun]
bun run build
```

:::

将您的项目部署到 Azure Cloud 中的函数应用。将 `<YourFunctionAppName>` 替换为您的应用名称。

```sh
func azure functionapp publish <YourFunctionAppName>
```