# AWS Lambda

AWS Lambda 是亚马逊网络服务提供的无服务器平台。  
您可以根据事件运行代码，并自动管理底层计算资源。

Hono 在 AWS Lambda 的 Node.js 18+ 环境中运行。  

```
function helloWorld() {
    console.log("Hello, World!");
}
```

## 1. 设置

在 AWS Lambda 上创建应用时，
[CDK](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-cdk.html)
对于设置 IAM 角色、API 网关等功能非常有用。

使用 `cdk` CLI 初始化你的项目。

::: code-group

```sh [npm]
mkdir my-app
cd my-app
cdk init app -l typescript
npm i hono
mkdir lambda
touch lambda/index.ts
```

```sh [yarn]
mkdir my-app
cd my-app
cdk init app -l typescript
yarn add hono
mkdir lambda
touch lambda/index.ts
```

```sh [pnpm]
mkdir my-app
cd my-app
cdk init app -l typescript
pnpm add hono
mkdir lambda
touch lambda/index.ts
```

```sh [bun]
mkdir my-app
cd my-app
cdk init app -l typescript
bun add hono
mkdir lambda
touch lambda/index.ts
```

:::

## 2. Hello World

编辑 `lambda/index.ts`。

```ts
import { Hono } from 'hono'
import { handle } from 'hono/aws-lambda'

const app = new Hono()

app.get('/', (c) => c.text('Hello Hono!'))

export const handler = handle(app)
```

## 3. 部署

编辑 `lib/cdk-stack.ts`。

```ts
import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as apigw from 'aws-cdk-lib/aws-apigateway'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'

export class MyAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const fn = new NodejsFunction(this, 'lambda', {
      entry: 'lambda/index.ts',
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_20_X,
    })
    fn.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
    })
    new apigw.LambdaRestApi(this, 'myapi', {
      handler: fn,
    })
  }
}
```

最后，运行命令进行部署：

```sh
cdk deploy
```

## 处理二进制数据

Hono 支持将二进制数据作为响应。在 Lambda 中，返回二进制数据时需要进行 base64 编码。一旦将二进制类型设置为 `Content-Type` 头，Hono 会自动将数据编码为 base64。

```ts
app.get('/binary', async (c) => {
  // ...
  c.status(200)
  c.header('Content-Type', 'image/png') // 表示二进制数据
  return c.body(buffer) // 支持 `ArrayBufferLike` 类型，编码为 base64。
})
```

## 访问 AWS Lambda 对象

在 Hono 中，您可以通过绑定 `LambdaEvent`、`LambdaContext` 类型并使用 `c.env` 来访问 AWS Lambda 事件和上下文。

```ts
import { Hono } from 'hono'
import type { LambdaEvent, LambdaContext } from 'hono/aws-lambda'
import { handle } from 'hono/aws-lambda'

type Bindings = {
  event: LambdaEvent
  lambdaContext: LambdaContext
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/aws-lambda-info/', (c) => {
  return c.json({
    isBase64Encoded: c.env.event.isBase64Encoded,
    awsRequestId: c.env.lambdaContext.awsRequestId,
  })
})

export const handler = handle(app)
```

## 访问请求上下文

在 Hono 中，您可以通过绑定 `LambdaEvent` 类型并使用 `c.env.event.requestContext` 来访问 AWS Lambda 请求上下文。

```ts
import { Hono } from 'hono'
import type { LambdaEvent } from 'hono/aws-lambda'
import { handle } from 'hono/aws-lambda'

type Bindings = {
  event: LambdaEvent
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/custom-context/', (c) => {
  const lambdaContext = c.env.event.requestContext
  return c.json(lambdaContext)
})

export const handler = handle(app)
```

### 在 v3.10.0 之前（已弃用）

您可以通过绑定 `ApiGatewayRequestContext` 类型并使用 `c.env.` 来访问 AWS Lambda 请求上下文。

```ts
import { Hono } from 'hono'
import type { ApiGatewayRequestContext } from 'hono/aws-lambda'
import { handle } from 'hono/aws-lambda'

type Bindings = {
  requestContext: ApiGatewayRequestContext
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/custom-context/', (c) => {
  const lambdaContext = c.env.requestContext
  return c.json(lambdaContext)
})

export const handler = handle(app)
```

## Lambda 响应流

通过更改 AWS Lambda 的调用模式，您可以实现 [流式响应](https://aws.amazon.com/blogs/compute/introducing-aws-lambda-response-streaming/)。

```diff
fn.addFunctionUrl({
  authType: lambda.FunctionUrlAuthType.NONE,
+  invokeMode: lambda.InvokeMode.RESPONSE_STREAM,
})
```

通常，实现需要使用 awslambda.streamifyResponse 将数据块写入 NodeJS.WritableStream，但使用 AWS Lambda 适配器，您可以通过使用 streamHandle 而不是 handle 来实现 Hono 的传统流式响应。

```ts
import { Hono } from 'hono'
import { streamHandle } from 'hono/aws-lambda'

const app = new Hono()

app.get('/stream', async (c) => {
  return streamText(c, async (stream) => {
    for (let i = 0; i < 3; i++) {
      await stream.writeln(`${i}`)
      await stream.sleep(1)
    }
  })
})

const handler = streamHandle(app)
```