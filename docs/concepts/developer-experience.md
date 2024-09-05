# Developer Experience

要创建一个优秀的应用程序，我们需要良好的开发体验。  
幸运的是，我们可以在 TypeScript 中为 Cloudflare Workers、Deno 和 Bun 编写应用程序，而无需转译为 JavaScript。  
Hono 是用 TypeScript 编写的，能够使应用程序类型安全。  

```javascript
// 代码示例
const app = new Hono();
app.get('/', (c) => c.text('Hello, World!'));
```