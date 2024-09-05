# 美化 JSON 中间件

美化 JSON 中间件为 JSON 响应体启用 "_JSON 美化打印_" 功能。
在 URL 查询参数中添加 `?pretty`，JSON 字符串将被美化。

```js
// GET /
{"project":{"name":"Hono","repository":"https://github.com/honojs/hono"}}
```

将变为：

```js
// GET /?pretty
{
  "project": {
    "name": "Hono",
    "repository": "https://github.com/honojs/hono"
  }
}
```

## 导入

```ts
import { Hono } from 'hono'
import { prettyJSON } from 'hono/pretty-json'
```

## 用法

```ts
const app = new Hono()

app.use(prettyJSON()) // 带选项: prettyJSON({ space: 4 })
app.get('/', (c) => {
  return c.json({ message: 'Hono!' })
})
```

## 选项

### <Badge type="info" text="可选" /> space: `number`

缩进的空格数。默认值为 `2`。

### <Badge type="info" text="可选" /> query: `string`

用于应用的查询字符串的名称。默认值为 `pretty`。