import { defineConfig } from 'vitepress'
import type { DefaultTheme } from 'vitepress'
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons'


const sidebars = (): DefaultTheme.SidebarItem[] => [
  {
    text: '概念',
    collapsed: true,
    items: [
      { text: '动机', link: '/docs/concepts/motivation' },
      { text: '路由', link: '/docs/concepts/routers' },
      { text: '基准测试', link: '/docs/concepts/benchmarks' },
      { text: 'Web 标准', link: '/docs/concepts/web-standard' },
      { text: '中间件', link: '/docs/concepts/middleware' },
      {
        text: '开发者体验',
        link: '/docs/concepts/developer-experience.md',
      },
      { text: 'Hono 栈', link: '/docs/concepts/stacks' },
    ],
  },
  {
    text: '入门指南',
    collapsed: true,
    items: [
      { text: '基础', link: '/docs/getting-started/basic' },
      {
        text: 'Cloudflare Workers',
        link: '/docs/getting-started/cloudflare-workers',
      },
      {
        text: 'Cloudflare Pages',
        link: '/docs/getting-started/cloudflare-pages',
      },
      { text: 'Deno', link: '/docs/getting-started/deno' },
      { text: 'Bun', link: '/docs/getting-started/bun' },
      {
        text: 'Fastly 计算',
        link: '/docs/getting-started/fastly',
      },
      { text: 'Vercel', link: '/docs/getting-started/vercel' },
      { text: 'Netlify', link: '/docs/getting-started/netlify' },
      {
        text: 'AWS Lambda',
        link: '/docs/getting-started/aws-lambda',
      },
      {
        text: 'Lambda@Edge',
        link: '/docs/getting-started/lambda-edge',
      },
      {
        text: 'Azure Functions',
        link: '/docs/getting-started/azure-functions',
      },
      {
        text: 'Supabase Functions',
        link: '/docs/getting-started/supabase-functions',
      },
      {
        text: '阿里云函数计算',
        link: '/docs/getting-started/ali-function-compute',
      },
      {
        text: '服务工作者',
        link: '/docs/getting-started/service-worker',
      },
      { text: 'Node.js', link: '/docs/getting-started/nodejs' },
    ],
  },
  {
    text: 'API',
    collapsed: true,
    items: [
      { text: '应用', link: '/docs/api/hono' },
      { text: '路由', link: '/docs/api/routing' },
      { text: '上下文', link: '/docs/api/context' },
      { text: 'HonoRequest', link: '/docs/api/request' },
      { text: '异常', link: '/docs/api/exception' },
      { text: '预设', link: '/docs/api/presets' },
    ],
  },
  {
    text: '指南',
    collapsed: true,
    items: [
      { text: '中间件', link: '/docs/guides/middleware' },
      { text: '助手', link: '/docs/guides/helpers' },
      {
        text: 'JSX',
        link: '/docs/guides/jsx',
      },
      {
        text: '客户端组件',
        link: '/docs/guides/jsx-dom',
      },
      { text: '测试', link: '/docs/guides/testing' },
      {
        text: '验证',
        link: '/docs/guides/validation',
      },
      {
        text: '远程过程调用 (RPC)',
        link: '/docs/guides/rpc',
      },
      {
        text: '最佳实践',
        link: '/docs/guides/best-practices',
      },
      {
        text: '其他杂项',
        link: '/docs/guides/others',
      },
      {
        text: '常见问题',
        link: '/docs/guides/faq',
      },
    ],
  },
  {
    text: '助手',
    collapsed: true,
    items: [
      { text: 'Accepts', link: '/docs/helpers/accepts' },
      { text: '适配器', link: '/docs/helpers/adapter' },
      { text: 'ConnInfo', link: '/docs/helpers/conninfo' },
      { text: 'Cookie', link: '/docs/helpers/cookie' },
      { text: 'css', link: '/docs/helpers/css' },
      { text: '开发', link: '/docs/helpers/dev' },
      { text: '工厂', link: '/docs/helpers/factory' },
      { text: 'html', link: '/docs/helpers/html' },
      { text: 'JWT', link: '/docs/helpers/jwt' },
      { text: 'SSG', link: '/docs/helpers/ssg' },
      { text: '流', link: '/docs/helpers/streaming' },
      { text: '测试', link: '/docs/helpers/testing' },
      { text: 'WebSocket', link: '/docs/helpers/websocket' },
    ],
  },
  {
    text: '中间件',
    collapsed: true,
    items: [
      {
        text: '基本认证',
        link: '/docs/middleware/builtin/basic-auth',
      },
      {
        text: 'Bearer 认证',
        link: '/docs/middleware/builtin/bearer-auth',
      },
      {
        text: '请求体限制',
        link: '/docs/middleware/builtin/body-limit',
      },
      { text: '缓存', link: '/docs/middleware/builtin/cache' },
      { text: '合并', link: '/docs/middleware/builtin/combine' },
      { text: '压缩', link: '/docs/middleware/builtin/compress' },
      { text: '跨域资源共享 (CORS)', link: '/docs/middleware/builtin/cors' },
      {
        text: 'CSRF 保护',
        link: '/docs/middleware/builtin/csrf',
      },
      { text: 'ETag', link: '/docs/middleware/builtin/etag' },
      {
        text: 'IP 限制',
        link: '/docs/middleware/builtin/ip-restriction',
      },
      {
        text: 'JSX 渲染器',
        link: '/docs/middleware/builtin/jsx-renderer',
      },
      { text: 'JWT', link: '/docs/middleware/builtin/jwt' },
      { text: '日志记录器', link: '/docs/middleware/builtin/logger' },
      {
        text: '方法覆盖',
        link: '/docs/middleware/builtin/method-override',
      },
      {
        text: '美化 JSON',
        link: '/docs/middleware/builtin/pretty-json',
      },
      {
        text: '请求 ID',
        link: '/docs/middleware/builtin/request-id',
      },
      {
        text: '安全头部',
        link: '/docs/middleware/builtin/secure-headers',
      },
      { text: '超时', link: '/docs/middleware/builtin/timeout' },
      { text: '计时', link: '/docs/middleware/builtin/timing' },
      {
        text: '尾随斜杠',
        link: '/docs/middleware/builtin/trailing-slash',
      },
      {
        text: '第三方中间件',
        link: '/docs/middleware/third-party',
      },
    ],
  },
]


export const sidebarsExamples = (): DefaultTheme.SidebarItem[] => [
  {
    text: '应用',
    items: [
      {
        text: 'Web API',
        link: '/examples/web-api',
      },
      {
        text: '代理',
        link: '/examples/proxy',
      },
      {
        text: '文件上传',
        link: '/examples/file-upload',
      },
      {
        text: 'Validator中的错误处理',
        link: '/examples/validator-error-handling',
      },
      {
        text: 'RPC路由分组',
        link: '/examples/grouping-routes-rpc',
      },
    ],
  },
  {
    text: '第三方中间件',
    items: [
      {
        text: 'Zod OpenAPI',
        link: '/examples/zod-openapi',
      },
      {
        text: 'Swagger UI',
        link: '/examples/swagger-ui',
      },
    ],
  },
  {
    text: '集成',
    items: [
      {
        text: 'Cloudflare Durable Objects',
        link: '/examples/cloudflare-durable-objects',
      },
      {
        text: 'Cloudflare 队列',
        link: '/examples/cloudflare-queue',
      },
      {
        text: 'Remix',
        link: '/examples/with-remix',
      },
      {
        text: 'htmx',
        link: '/examples/htmx',
      },
      {
        text: 'Stripe Webhook',
        link: '/examples/stripe-webhook',
      },
      {
        text: 'Prisma 在 Cloudflare 上',
        link: '/examples/prisma',
      },
      {
        text: 'Pylon (GraphQL)',
        link: '/examples/pylon',
      },
    ],
  },
]

export default defineConfig({
  lang: 'zh-CN',
  title: 'Hono',
  description:
    '一个超快的Web框架，支持Cloudflare Workers、Fastly Compute、Deno、Bun、Vercel、Node.js等。快，但不仅仅是快。',
  lastUpdated: true,
  ignoreDeadLinks: true,
  cleanUrls: true,
  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },
    config(md) {
      md.use(groupIconMdPlugin)
    },
  },
  themeConfig: {
    logo: '/images/logo-small.png',
    siteTitle: 'Hono',
    algolia: {
      appId: '1GIFSU1REV',
      apiKey: '6a9bb2036e456356e224ece74546ca14',
      indexName: 'hono',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/honojs' },
      { icon: 'discord', link: 'https://discord.gg/KMh2eNSdxV' },
      { icon: 'x', link: 'https://twitter.com/honojs' },
    ],
    editLink: {
      pattern: 'https://github.com/hypier/hono_docs_cn/edit/main/:path',
      text: '在 GitHub 上编辑此页面',
    },
    footer: {
      message: '根据 MIT 许可证发布。',
      copyright:
        '版权所有 © 2022-至今 Yusuke Wada & Hono 贡献者。 "kawaii" 标志由 SAWARATSUKI 创建。',
    },
    nav: [
      { text: '文档', link: '/docs/' },
      { text: '示例', link: '/examples/' },
      {
        text: '讨论',
        link: 'https://github.com/orgs/honojs/discussions',
      },
    ],
    sidebar: {
      '/': sidebars(),
      '/examples/': sidebarsExamples(),
    },
  },
  head: [
    [
      'meta',
      {
        property: 'og:image',
        content: 'https://hono.dev/images/hono-title.png',
      },
    ],
    ['meta', { property: 'og:type', content: '网站' }],
    ['meta', { property: 'twitter:domain', content: 'hono.dev' }],
    [
      'meta',
      {
        property: 'twitter:image',
        content: 'https://hono.dev/images/hono-title.png',
      },
    ],
    [
      'meta',
      { property: 'twitter:card', content: 'summary_large_image' },
    ],
    ['link', { rel: 'shortcut icon', href: '/favicon.ico' }],
  ],
  titleTemplate: ':title - Hono',
  vite: {
    plugins: [
      groupIconVitePlugin({
        customIcon: {
          cloudflare: 'logos:cloudflare-workers-icon'
        }
      })
    ],
  }
})
