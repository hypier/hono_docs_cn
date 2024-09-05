# 阿里云函数计算

[阿里云函数计算](https://www.alibabacloud.com/en/product/function-compute) 是一种完全托管的事件驱动计算服务。函数计算使您能够专注于编写和上传代码，而无需管理服务器等基础设施。

```
# 代码示例
def hello_world(event, context):
    return 'Hello, World!'
```

## 1. 设置

> [serverless-devs](https://github.com/Serverless-Devs/Serverless-Devs) 是一个开源的无服务器开发平台，致力于为开发者提供强大的工具链系统。通过该平台，开发者不仅可以一键体验多云无服务器产品，快速部署无服务器项目，还可以在无服务器应用的整个生命周期中管理项目，并与其他工具/平台简单快速地结合，以进一步提高研发、运维的效率。

安装 [serverless-devs](https://github.com/Serverless-Devs/Serverless-Devs) CLI

```sh
npm install @serverless-devs/s -g
```

添加 AK 和 SK 配置

```sh
s config add
# 请选择一个提供者：阿里云 (alibaba)
# 输入您的 AccessKeyID 和 AccessKeySecret
```

## 2. Hello World

在新目录中创建一个新项目：

```sh
npm init
```

添加所需的依赖项：

```sh
npm add hono @hono/node-server
npm add esbuild --save-dev
```

编辑 `package.json` 中的 `scripts` 部分：

```json
{
  "scripts": {
    "build": "esbuild --bundle --outfile=./dist/index.js --platform=node --target=node20 ./src/index.ts",
    "dev": "node ./dist/index.js",
    "deploy": "s deploy -y"
  }
}
```

编辑 `src/index.ts`：

```ts
import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const REQUEST_ID_HEADER = 'x-fc-request-id'

const app = new Hono()

app.post('/initialize', (c) => {
  console.log(`RequestId: ${c.req.header(REQUEST_ID_HEADER)}`)
  return c.text('Initialize')
})

app.post('/invoke', (c) => {
  console.log(`RequestId: ${c.req.header(REQUEST_ID_HEADER)}`)
  return c.text('Invoke')
})

app.get('/', (c) => {
  return c.text('Hello from index!')
})

app.get('/hello', (c) => {
  return c.text('Hi!')
})

const port = 9000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port,
})
```

编辑 `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "skipLibCheck": true,
    "lib": ["ESNext"],
    "types": [],
    "jsx": "react-jsx",
    "jsxImportSource": "hono/jsx"
  }
}
```

编辑 `s.yaml`：

```yaml
edition: 3.0.0
name: my-app
access: 'default'

vars:
  region: 'us-west-1'

resources:
  my_app:
    component: fc3
    props:
      region: ${vars.region}
      functionName: 'my-app'
      runtime: 'custom.debian10'
      description: 'hello world by Hono'
      timeout: 10
      memorySize: 512
      environmentVariables:
        PATH: >-
          /var/fc/lang/nodejs20/bin:/usr/local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/opt/bin
        NODE_PATH: /opt/nodejs/node_modules
      cpu: 0.5
      diskSize: 512
      code: ./dist
      customRuntimeConfig:
        command:
          - node
          - index.js
        port: 9000
      triggers:
        - triggerConfig:
            methods:
              - GET
              - POST
              - PUT
              - DELETE
            authType: anonymous
            disableURLInternet: false
          triggerName: default
          description: ''
          qualifier: LATEST
          triggerType: http
```

## 3. 部署

最后，运行命令进行部署：

```sh
npm install # install dependencies
npm run build # Compile the TypeScript code to JavaScript
npm run deploy # Deploy the function to Alibaba Cloud Function Compute
```