# 请求体大小限制中间件

请求体大小限制中间件可以限制请求体的文件大小。

该中间件首先使用请求中 `Content-Length` 头的值（如果存在）。如果未设置，它会在流中读取请求体，并在其大于指定文件大小时执行错误处理程序。

```
function limitRequestBody(req, res, next) {
    const maxSize = 1e6; // 1 MB
    const contentLength = req.headers['content-length'];

    if (contentLength && contentLength > maxSize) {
        return res.status(413).send('Request Entity Too Large');
    }

    let body = [];
    req.on('data', chunk => {
        body.push(chunk);
        if (Buffer.concat(body).length > maxSize) {
            req.destroy();
            return res.status(413).send('Request Entity Too Large');
        }
    });

    req.on('end', () => {
        req.body = Buffer.concat(body).toString();
        next();
    });
}
```

## 导入

```ts
import { Hono } from 'hono'
import { bodyLimit } from 'hono/body-limit'
```

## 用法

```ts
const app = new Hono()

app.post(
  '/upload',
  bodyLimit({
    maxSize: 50 * 1024, // 50kb
    onError: (c) => {
      return c.text('overflow :(', 413)
    },
  }),
  async (c) => {
    const body = await c.req.parseBody()
    if (body['file'] instanceof File) {
      console.log(`Got file sized: ${body['file'].size}`)
    }
    return c.text('pass :)')
  }
)
```

## Options

### <Badge type="danger" text="必填" /> maxSize: `number`

您想要限制的文件的最大文件大小。默认值为 `100 * 1024` - `100kb`。

### <Badge type="info" text="可选" /> onError: `OnError`

如果超过指定文件大小，将调用的错误处理程序。

## 与 Bun 一起使用以处理大请求

如果显式使用了 Body Limit Middleware 来允许请求体大于默认值，则可能需要相应地更改您的 `Bun.serve` 配置。[在撰写时](https://github.com/oven-sh/bun/blob/f2cfa15e4ef9d730fc6842ad8b79fb7ab4c71cb9/packages/bun-types/bun.d.ts#L2191)，`Bun.serve` 的默认请求体限制为 128MiB。如果您将 Hono 的 Body Limit Middleware 设置为比这个值更大的值，您的请求仍然会失败，并且在中间件中指定的 `onError` 处理程序将不会被调用。这是因为 `Bun.serve()` 会将状态码设置为 `413`，并在将请求传递给 Hono 之前终止连接。

如果您希望使用 Hono 和 Bun 接受大于 128MiB 的请求，您还需要为 Bun 设置限制：

```ts
export default {
  port: process.env['PORT'] || 3000,
  fetch: app.fetch,
  maxRequestBodySize: 1024 * 1024 * 200, // your value here
}
```

或者，根据您的设置：

```ts
Bun.serve({
  fetch(req, server) {
    return app.fetch(req, { ip: server.requestIP(req) })
  },
  maxRequestBodySize: 1024 * 1024 * 200, // your value here
})
```