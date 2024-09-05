# css Helper

css helper - `hono/css` - 是 Hono 内置的 CSS in JS(X)。

您可以在名为 `css` 的 JavaScript 模板字面量中以 JSX 的形式编写 CSS。`css` 的返回值将是类名，该类名被设置为 class 属性的值。然后，`<Style />` 组件将包含 CSS 的值。

## 导入

```ts
import { Hono } from 'hono'
import { css, cx, keyframes, Style } from 'hono/css'
```

## `css` <Badge style="vertical-align: middle;" type="warning" text="实验性" />

您可以在 `css` 模板字面量中编写 CSS。在这种情况下，它将 `headerClass` 用作 `class` 属性的值。不要忘记添加 `<Style />`，因为它包含 CSS 内容。

```ts{10,13}
app.get('/', (c) => {
  const headerClass = css`
    background-color: orange;
    color: white;
    padding: 1rem;
  `
  return c.html(
    <html>
      <head>
        <Style />
      </head>
      <body>
        <h1 class={headerClass}>Hello!</h1>
      </body>
    </html>
  )
})
```

您可以使用 [嵌套选择器](https://developer.mozilla.org/en-US/docs/Web/CSS/Nesting_selector) `&` 来为伪类如 `:hover` 添加样式：

```ts
const buttonClass = css`
  background-color: #fff;
  &:hover {
    background-color: red;
  }
`
```

### 扩展

您可以通过嵌入类名来扩展 CSS 定义。

```tsx
const baseClass = css`
  color: white;
  background-color: blue;
`

const header1Class = css`
  ${baseClass}
  font-size: 3rem;
`

const header2Class = css`
  ${baseClass}
  font-size: 2rem;
`
```

此外，`${baseClass} {}` 的语法使得类的嵌套成为可能。

```tsx
const headerClass = css`
  color: white;
  background-color: blue;
`
const containerClass = css`
  ${headerClass} {
    h1 {
      font-size: 3rem;
    }
  }
`
return c.render(
  <div class={containerClass}>
    <header class={headerClass}>
      <h1>Hello!</h1>
    </header>
  </div>
)
```

### 全局样式

一个名为 `:-hono-global` 的伪选择器允许你定义全局样式。

```tsx
const globalClass = css`
  :-hono-global {
    html {
      font-family: Arial, Helvetica, sans-serif;
    }
  }
`

return c.render(
  <div class={globalClass}>
    <h1>Hello!</h1>
    <p>Today is a good day.</p>
  </div>
)
```

或者你可以在 `<Style />` 组件中使用 `css` 字面量编写 CSS。

```tsx
export const renderer = jsxRenderer(({ children, title }) => {
  return (
    <html>
      <head>
        <Style>{css`
          html {
            font-family: Arial, Helvetica, sans-serif;
          }
        `}</Style>
        <title>{title}</title>
      </head>
      <body>
        <div>{children}</div>
      </body>
    </html>
  )
})
```

## `keyframes` <Badge style="vertical-align: middle;" type="warning" text="实验性" />

您可以使用 `keyframes` 来编写 `@keyframes` 的内容。在这种情况下，`fadeInAnimation` 将是动画的名称

```tsx
const fadeInAnimation = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`
const headerClass = css`
  animation-name: ${fadeInAnimation};
  animation-duration: 2s;
`
const Header = () => <a class={headerClass}>Hello!</a>
```

## `cx` <Badge style="vertical-align: middle;" type="warning" text="实验性" />

`cx` 组合了两个类名。

```tsx
const buttonClass = css`
  border-radius: 10px;
`
const primaryClass = css`
  background: orange;
`
const Button = () => (
  <a class={cx(buttonClass, primaryClass)}>Click!</a>
)
```

它也可以组合简单的字符串。

```tsx
const Header = () => <a class={cx('h1', primaryClass)}>Hi</a>
```

## 提示

如果您使用 VS Code，可以使用 [vscode-styled-components](https://marketplace.visualstudio.com/items?itemName=styled-components.vscode-styled-components) 来实现 css 标签字面量的语法高亮和智能感知。

![VS Code](./../../public/images/css-ss.png)

```javascript
const Button = styled.button`
  background: blue;
  color: white;
  padding: 10px;
`;
```