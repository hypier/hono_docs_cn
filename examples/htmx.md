# htmx

使用 Hono 和 [htmx](https://htmx.org/)。

## typed-htmx

通过使用 [typed-htmx](https://github.com/Desdaemon/typed-htmx)，您可以为 htmx 属性编写带有 TypeScript 定义的 JSX。  
我们可以遵循在 [typed-htmx 示例项目](https://github.com/Desdaemon/typed-htmx/blob/main/example/src/types.d.ts) 中找到的相同模式，将其与 `hono/jsx` 一起使用。

安装包：

```sh
npm i -D typed-htmx
```

在 `src/global.d.ts`（如果您使用的是 HonoX，则为 `app/global.d.ts`）中，导入 `typed-htmx` 类型：

```ts
import 'typed-htmx'
```

使用 typed-htmx 定义扩展 Hono 的 JSX 类型：

```ts
// A demo of how to augment foreign types with htmx attributes.
// In this case, Hono sources its types from its own namespace, so we do the same
// and directly extend its namespace.
declare module 'hono/jsx' {
  namespace JSX {
    interface HTMLAttributes extends HtmxAttributes {}
  }
}
```

## 另见

- [htmx](https://htmx.org/)
- [typed-htmx](https://github.com/Desdaemon/typed-htmx)