# Server-Timing 中间件

[Server-Timing](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Server-Timing) 中间件在响应头中提供性能指标。

::: info
注意：在 Cloudflare Workers 上，计时器指标可能不准确，因为 [计时器仅显示最后 I/O 的时间](https://developers.cloudflare.com/workers/learning/security-model/#step-1-disallow-timers-and-multi-threading)。
:::

## 导入

```ts [npm]
import { Hono } from 'hono'
import { timing, setMetric, startTime, endTime } from 'hono/timing'
import type { TimingVariables } from 'hono/timing'
```

## 用法

```js
// Specify the variable types to infer the `c.get('metric')`:
type Variables = TimingVariables

const app = new Hono<{ Variables: Variables }>()

// add the middleware to your router
app.use(timing());

app.get('/', async (c) => {

  // add custom metrics
  setMetric(c, 'region', 'europe-west3')

  // add custom metrics with timing, must be in milliseconds
  setMetric(c, 'custom', 23.8, 'My custom Metric')

  // start a new timer
  startTime(c, 'db');
  const data = await db.findMany(...);

  // end the timer
  endTime(c, 'db');

  return c.json({ response: data });
});
```

### 条件启用

```ts
const app = new Hono()

app.use(
  '*',
  timing({
    // c: 请求的上下文
    enabled: (c) => c.req.method === 'POST',
  })
)
```

## 结果

![示例时间输出](/images/timing-example.png)

## 选项

### <Badge type="info" text="可选" /> total: `boolean`

显示总响应时间。默认值为 `true`。

### <Badge type="info" text="optional" /> enabled: `boolean` | `(c: Context) => boolean`

是否应将时间添加到标题中。默认值为 `true`。

### <Badge type="info" text="可选" /> totalDescription: `boolean`

总响应时间的描述。默认值为 `总响应时间`。

### <Badge type="info" text="可选" /> autoEnd: `boolean`

如果 `startTime()` 应该在请求结束时自动结束。
如果禁用，则不会显示未手动结束的计时器。

### <Badge type="info" text="optional" /> crossOrigin: `boolean` | `string` | `(c: Context) => boolean | string`

此时间头的来源应可读。

- 如果为 false，仅来自当前来源。
- 如果为 true，来自所有来源。
- 如果为 string，来自此域。多个域必须用逗号分隔。

默认值为 `false`。查看更多 [docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Timing-Allow-Origin)。