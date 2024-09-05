# 在 Cloudflare Workers 上使用 Prisma

有两种方法可以在 Cloudflare Workers 中使用 Prisma，我们将使用 Prisma Accelerate，但您也可以使用 Prisma [Driver Adapter](https://www.prisma.io/docs/orm/overview/databases/database-drivers)。

### 安装 Prisma

在您的 Hono Cloudflare Workers 上安装 Prisma。在这里，我使用 neon.tech 的免费套餐作为我的 PostgreSQL 数据库，但您可以使用适合您项目的任何数据库。

访问 [neon.tech](https://neon.tech/) 并创建一个免费的 PostgreSQL 数据库。

```bash
npm i prisma --save-dev
npx prisma init
```

## 设置 Prisma Accelerate

要设置 Accelerate，请访问 [Prisma Accelerate](https://www.prisma.io/data-platform/accelerate?via=start&gad_source=1&gclid=CjwKCAjwvIWzBhAlEiwAHHWgvX8l8e7xQtqurVYanQ6LmbNheNvCB-4FL0G6BFEfPrUdGyH3qSllqxoCXDoQAvD_BwE) 并登录或免费注册。

登录后，您将进入一个可以创建新 Accelerate 项目的页面。

![Accelerate Page](/images/prismaAcceleratePage.png)

通过点击 `New project` 按钮创建一个新项目，并为您的项目命名。

![Accelerate Page](/images/accelerateCreateProject.png)

接下来，您将进入如下所示的页面：

![Accelerate Edit Page](/images/accelerateProjectPage.png)

点击 `Enable Accelerate` 按钮，您将进入下一个页面：

![Enable Page](/images/EnableAccelerate.png)

将您的 neon.tech 数据库连接字符串粘贴到 `database connection string` 字段，选择您的区域，然后点击 `Enable Accelerate` 按钮。

您将看到类似于以下内容的界面：

![API Key](/images/generateApiKey.png)

点击 `Generate API Key`，您将收到一个新的 API 密钥，类似于以下内容：

```bash
DATABASE_URL="prisma://accelerate...."
```

复制此 `DATABASE_URL` 并将其存储在 `.dev.vars` 和 `.env` 中，以便 prisma cli 后续可以访问。

## 在您的项目中设置 Prisma

您收到的 neon.tech URL 也可以作为替代方案，并为 Prisma 提供更多选项，因此请将其存储以备后用：

::: code-group

```bash [.dev.vars]
DATABASE_URL="your_prisma_accelerate_url"
DIRECT_URL="your_neon_tech_url"
```

:::

现在，转到您的 `schema.prisma` 文件并像这样设置 URLs：

::: code-group

```ts [schema.prisma]
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

:::

创建一个这样的函数，您可以在项目中稍后使用：

::: code-group

```ts [prismaFunction.ts]
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

export const getPrisma = (database_url: string) => {
  const prisma = new PrismaClient({
    datasourceUrl: database_url,
  }).$extends(withAccelerate())
  return prisma
}
```

:::

以下是如何在项目中使用此函数的示例：

::: code-group

```ts [index.ts]
import { Hono } from 'hono'
import { sign, verify } from 'hono/jwt'
import { getPrisma } from '../usefulFun/prismaFun'

// 创建主 Hono 应用
const app = new Hono<{
  Bindings: {
    DATABASE_URL: string
    JWT_SECRET: string
  }
  Variables: {
    userId: string
  }
}>()

app.post('/', async (c) => {
  // 现在您可以在任何地方使用它
  const prisma = getPrisma(c.env.DATABASE_URL)
})
```

:::