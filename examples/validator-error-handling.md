# 验证器中的错误处理

通过使用验证器，您可以更轻松地处理无效输入。此示例向您展示了如何利用回调结果来实现自定义错误处理。

尽管此代码片段使用了 [Zod Validator](https://github.com/honojs/middleware/blob/main/packages/zod-validator)，但您可以使用任何支持的验证器库应用类似的方法。

```ts
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

const app = new Hono()

const userSchema = z.object({
  name: z.string(),
  age: z.number(),
})

app.post(
  '/users/new',
  zValidator('json', userSchema, (result, c) => {
    if (!result.success) {
      return c.text('Invalid!', 400)
    }
  }),
  async (c) => {
    const user = c.req.valid('json')
    console.log(user.name) // string
    console.log(user.age) // number
  }
)
```

## 另请参阅

- [Zod Validator](https://github.com/honojs/middleware/blob/main/packages/zod-validator)
- [Valibot Validator](https://github.com/honojs/middleware/tree/main/packages/valibot-validator)
- [Typebox Validator](https://github.com/honojs/middleware/tree/main/packages/typebox-validator)
- [Typia Validator](https://github.com/honojs/middleware/tree/main/packages/typia-validator)