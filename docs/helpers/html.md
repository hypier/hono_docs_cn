# html Helper

html Helper 允许您在 JavaScript 模板字面量中使用名为 `html` 的标签编写 HTML。使用 `raw()`，内容将按原样呈现。您必须自己转义这些字符串。

## 导入

```ts
import { Hono } from 'hono'
import { html, raw } from 'hono/html'
```

## `html`

```ts
const app = new Hono()

app.get('/:username', (c) => {
  const { username } = c.req.param()
  return c.html(
    html`<!doctype html>
      <h1>你好！${username}!</h1>`
  )
})
```

### 将代码片段插入到 JSX 中

将内联脚本插入到 JSX 中：

```tsx
app.get('/', (c) => {
  return c.html(
    <html>
      <head>
        <title>Test Site</title>
        {html`
          <script>
            // No need to use dangerouslySetInnerHTML.
            // If you write it here, it will not be escaped.
          </script>
        `}
      </head>
      <body>Hello!</body>
    </html>
  )
})
```

### 作为功能组件

由于 `html` 返回一个 HtmlEscapedString，它可以作为一个完全的功能组件，而无需使用 JSX。

#### 使用 `html` 来加速过程，而不是使用 `memo`

```typescript
const Footer = () => html`
  <footer>
    <address>My Address...</address>
  </footer>
`
```

### 接收 props 并嵌入值

```typescript
interface SiteData {
  title: string
  description: string
  image: string
  children?: any
}
const Layout = (props: SiteData) => html`
<html>
<head>
  <meta charset="UTF-8">
  <title>${props.title}</title>
  <meta name="description" content="${props.description}">
  <head prefix="og: http://ogp.me/ns#">
  <meta property="og:type" content="article">
  <!-- More elements slow down JSX, but not template literals. -->
  <meta property="og:title" content="${props.title}">
  <meta property="og:image" content="${props.image}">
</head>
<body>
  ${props.children}
</body>
</html>
`

const Content = (props: { siteData: SiteData; name: string }) => (
  <Layout {...props.siteData}>
    <h1>你好 {props.name}</h1>
  </Layout>
)

app.get('/', (c) => {
  const props = {
    name: '世界',
    siteData: {
      title: '你好 <> 世界',
      description: '这是一个描述',
      image: 'https://example.com/image.png',
    },
  }
  return c.html(<Content {...props} />)
})
```

## `raw()`

```ts
app.get('/', (c) => {
  const name = 'John &quot;Johnny&quot; Smith'
  return c.html(html`<p>I'm ${raw(name)}.</p>`)
})
```

## 提示

由于这些库，Visual Studio Code 和 vim 也将模板字面量解释为 HTML，从而允许应用语法高亮和格式化。

- <https://marketplace.visualstudio.com/items?itemName=bierner.lit-html>
- <https://github.com/MaxMEllon/vim-jsx-pretty>