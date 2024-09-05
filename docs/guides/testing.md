# 测试

测试是重要的。
实际上，测试 Hono 的应用程序很简单。
创建测试环境的方法因每个运行时而异，但基本步骤是相同的。
在本节中，让我们使用 Cloudflare Workers 和 Jest 进行测试。

## 请求和响应

您所要做的就是创建一个请求并将其传递给 Hono 应用程序以验证响应。
并且，您可以使用 `app.request` 这个有用的方法。

::: tip
有关类型化测试客户端，请参见 [testing helper](/docs/helpers/testing)。
:::

例如，考虑一个提供以下 REST API 的应用程序。

```ts
app.get('/posts', (c) => {
  return c.text('Many posts')
})

app.post('/posts', (c) => {
  return c.json(
    {
      message: 'Created',
    },
    201,
    {
      'X-Custom': 'Thank you',
    }
  )
})
```

向 `GET /posts` 发起请求并测试响应。

```ts
describe('Example', () => {
  test('GET /posts', async () => {
    const res = await app.request('/posts')
    expect(res.status).toBe(200)
    expect(await res.text()).toBe('Many posts')
  })
})
```

要向 `POST /posts` 发起请求，请执行以下操作。

```ts
test('POST /posts', async () => {
  const res = await app.request('/posts', {
    method: 'POST',
  })
  expect(res.status).toBe(201)
  expect(res.headers.get('X-Custom')).toBe('Thank you')
  expect(await res.json()).toEqual({
    message: 'Created',
  })
})
```

要向 `POST /posts` 发起带有 `JSON` 数据的请求，请执行以下操作。

```ts
test('POST /posts', async () => {
  const res = await app.request('/posts', {
    method: 'POST',
    body: JSON.stringify({ message: 'hello hono' }),
    headers: new Headers({ 'Content-Type': 'application/json' }),
  })
  expect(res.status).toBe(201)
  expect(res.headers.get('X-Custom')).toBe('Thank you')
  expect(await res.json()).toEqual({
    message: 'Created',
  })
})
```

要向 `POST /posts` 发起带有 `multipart/form-data` 数据的请求，请执行以下操作。

```ts
test('POST /posts', async () => {
  const formData = new FormData()
  formData.append('message', 'hello')
  const res = await app.request('/posts', {
    method: 'POST',
    body: formData,
  })
  expect(res.status).toBe(201)
  expect(res.headers.get('X-Custom')).toBe('Thank you')
  expect(await res.json()).toEqual({
    message: 'Created',
  })
})
```

您还可以传递 Request 类的实例。

```ts
test('POST /posts', async () => {
  const req = new Request('http://localhost/posts', {
    method: 'POST',
  })
  const res = await app.request(req)
  expect(res.status).toBe(201)
  expect(res.headers.get('X-Custom')).toBe('Thank you')
  expect(await res.json()).toEqual({
    message: 'Created',
  })
})
```

通过这种方式，您可以像进行端到端测试一样进行测试。

## 环境

要为测试设置 `c.env`，可以将其作为第三个参数传递给 `app.request`。这对于模拟像 [Cloudflare Workers Bindings](https://hono.dev/getting-started/cloudflare-workers#bindings) 这样的值非常有用：

```ts
const MOCK_ENV = {
  API_HOST: 'example.com',
  DB: {
    prepare: () => {
      /* mocked D1 */
    },
  },
}

test('GET /posts', async () => {
  const res = await app.request('/posts', {}, MOCK_ENV)
})
```