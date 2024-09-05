```html
<script setup>
import { data } from './menu.data.ts'
</script>
```

# 示例

在本节中，您可以看到使用 Hono 创建应用程序的实际示例。

<div v-for="sections of data">
  <section v-for="category of sections">
    <h2>{{ category.text }}</h2>
    <ul v-for="item of category.items">
      <li><a :href="item.link">{{ item.text }}</a></li>
    </ul>
  </section>
</div>

## GitHub 仓库

您还可以在 GitHub 仓库中查看示例：[Hono 示例](https://github.com/honojs/examples)