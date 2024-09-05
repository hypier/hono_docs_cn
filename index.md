---
title: Hono - 超快的边缘网页框架
titleTemplate: ':title'
head:
  - [
      'meta',
      {
        property: 'og:description',
        content: 'Hono是一个小巧、简单且超快的边缘网页框架。它可以在Cloudflare Workers、Fastly Compute、Deno、Bun、Vercel、Netlify、AWS Lambda、Lambda@Edge和Node.js上运行。快速，但不仅仅是快速。',
      },
    ]
layout: home
hero:
  name: Hono
  text: 网页应用框架
  tagline: 快速、轻量，基于Web标准。支持任何JavaScript运行时。
  image:
    src: /images/code.webp
    alt: Hono
  actions:
    - theme: brand
      text: 开始使用
      link: /docs/
    - theme: alt
      text: 在GitHub上查看
      link: https://github.com/honojs/hono
features:
  - icon: 🚀
    title: 超快与轻量
    details: 路由器RegExpRouter非常快。hono/tiny预设小于14kB。仅使用Web标准API。
  - icon: 🌍
    title: 多运行时
    details: 可在Cloudflare、Fastly、Deno、Bun、AWS或Node.js上运行。相同的代码可以在所有平台上运行。
  - icon: 🔋
    title: 内置功能
    details: Hono具有内置中间件、自定义中间件、第三方中间件和辅助功能。内置功能齐全。
  - icon: 😃
    title: 令人愉快的开发体验
    details: 超级干净的API。一流的TypeScript支持。现在，我们有了“类型”。
---

<script setup>
// Heavily inspired by React
// https://github.com/reactjs/react.dev/pull/6817
import { onMounted } from 'vue'
onMounted(() => {
  var preferredKawaii
  try {
    preferredKawaii = localStorage.getItem('kawaii')
  } catch (err) {}
  const urlParams = new URLSearchParams(window.location.search)
  const kawaii = urlParams.get('kawaii')
  const setKawaii = () => {
    const images = document.querySelectorAll('.VPImage.image-src')
    images.forEach((img) => {
      img.src = '/images/hono-kawaii.png'
      img.classList.add("kawaii")
    })
  }
  if (kawaii === 'true') {
    try {
      localStorage.setItem('kawaii', true)
    } catch (err) {}
    console.log('kawaii mode enabled. logo credits to @sawaratsuki1004 via https://github.com/SAWARATSUKI/ServiceLogos');
    setKawaii()
  } else if (kawaii === 'false') {
    try {
      localStorage.removeItem('kawaii', false)
    } catch (err) {}
    const images = document.querySelectorAll('.VPImage.image-src')
    images.forEach((img) => {
      img.src = '/images/code.webp'
      img.classList.remove("kawaii")
    })
  } else if (preferredKawaii) {
    setKawaii()
  }
})
</script>