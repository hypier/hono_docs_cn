# 中间件

我们将返回 `Response` 的原语称为 "Handler"。
"Middleware" 在 Handler 之前和之后执行，并处理 `Request` 和 `Response`。
它就像洋葱结构。

![Onion](/images/onion.png)

例如，我们可以编写中间件来添加 "X-Response-Time" 头，如下所示。

```ts
app.use(async (c, next) => {
  const start = Date.now()
  await next()
  const end = Date.now()
  c.res.headers.set('X-Response-Time', `${end - start}`)
})
```

通过这种简单的方法，我们可以编写自定义中间件，并且可以使用内置或第三方中间件。