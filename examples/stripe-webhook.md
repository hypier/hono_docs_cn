# Stripe Webhook

这介绍了如何使用 Hono 创建一个 API 来接收 Stripe Webhook 事件。

## 准备

请首先安装官方的 Stripe SDK：

```bash
npm install stripe
```

并将以下值放入 `.dev.vars` 文件中以插入 Stripe API 密钥：

```
STRIPE_API_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

您可以通过以下文档了解 Stripe API 密钥：

- 密钥： https://docs.stripe.com/keys
- Webhook 密钥： https://docs.stripe.com/webhooks

## 如何保护 Stripe Webhook 事件的 API

处理 webhook 事件的 API 是公开可访问的。因此，需要一个机制来保护它免受恶意第三方伪造 Stripe 的 webhook 事件对象并发送请求等攻击。在 Stripe 的情况下，您可以通过发放 webhook 密钥并验证每个请求来保护 API。

了解更多： https://docs.stripe.com/webhooks?lang=node#verify-official-libraries

## 通过托管环境或框架实现 Webhook API

要使用 Stripe 进行签名验证，需要原始请求体。当使用框架时，需要确保原始体未被修改。如果对原始请求体进行任何更改，验证将失败。

在 Hono 的情况下，我们可以通过 `context.req.text()` 方法获取原始请求体。因此，我们可以像下面的示例一样创建 webhook API：

```ts
import Stripe from 'stripe'
import { Hono } from 'hono'
import { env } from 'hono/adapter'

const app = new Hono()

app.post('/webhook', async (context) => {
  const { STRIPE_SECRET_API_KEY, STRIPE_WEBHOOK_SECRET } =
    env(context)
  const stripe = new Stripe(STRIPE_SECRET_API_KEY)
  const signature = context.req.header('stripe-signature')
  try {
    if (!signature) {
      return context.text('', 400)
    }
    const body = await context.req.text()
    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      STRIPE_WEBHOOK_SECRET
    )
    switch (event.type) {
      case 'payment_intent.created': {
        console.log(event.data.object)
        break
      }
      default:
        break
    }
    return context.text('', 200)
  } catch (err) {
    const errorMessage = `⚠️  Webhook signature verification failed. ${
      err instanceof Error ? err.message : 'Internal server error'
    }`
    console.log(errorMessage)
    return context.text(errorMessage, 400)
  }
})

export default app
```

## 另请参阅

- Stripe Webhooks 的详细信息：
  https://docs.stripe.com/webhooks
- 实现支付处理：
  https://docs.stripe.com/payments/handling-payment-events
- 实现订阅：
  https://docs.stripe.com/billing/subscriptions/webhooks
- Stripe 发送的 webhook 事件列表：
  https://docs.stripe.com/api/events
- Cloudflare 的示例模板：
  https://github.com/stripe-samples/stripe-node-cloudflare-worker-template/