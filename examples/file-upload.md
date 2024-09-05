# 文件上传

您可以上传一个 `multipart/form-data` 内容类型的文件。上传的文件将可以在 `c.req.parseBody()` 中获取。

```ts
const app = new Hono()

app.post('/upload', async (c) => {
  const body = await c.req.parseBody()
  console.log(body['file']) // File | string
})
```

## 另见

- [API - HonoRequest - parseBody](/docs/api/request#parsebody)