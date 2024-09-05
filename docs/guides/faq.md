# 常见问题解答

本指南是关于 Hono 的常见问题 (FAQ) 及其解决方法的汇总。

## Hono 是否有官方的 Renovate 配置？

Hono 团队目前并不维护 [Renovate](https://github.com/renovatebot/renovate) 配置。  
因此，请使用第三方的 renovate-config，如下所示。

在你的 `renovate.json` 中：

```json
// renovate.json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": [
    "github>shinGangan/renovate-config-hono" // [!code ++]
  ]
}
```

有关更多详细信息，请参见 [renovate-config-hono](https://github.com/shinGangan/renovate-config-hono) 仓库。