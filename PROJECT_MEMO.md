# 兰清堂 — 项目备忘录

> 这个文件是给 AI 助手看的，记录项目的关键信息，防止上下文压缩后丢失记忆。
> 每次重大改动后更新。

## 项目基本信息

- **项目名**：兰清堂（深色古风祈福网站）
- **类型**：Next.js 16 静态网站（App Router + TypeScript + Tailwind CSS v4）
- **GitHub**：https://github.com/sutongwuyanzu/lanqing-tang
- **线上地址**：https://lanqing-tang.pages.dev
- **部署平台**：Cloudflare Pages（静态导出模式）
- **GitHub 账号**：sutongwuyanzu

## 部署配置（重要！）

Cloudflare Pages 项目设置：
- **Build command**：`npm run build`
- **Build output directory**：`out`
- **环境变量**：`NODE_VERSION = 20`
- **next.config.ts** 里 `output: "export"`（静态导出）

## 页面清单

| 页面 | 路径 | 功能 |
|------|------|------|
| 首页 | `/` | 四大善门入口 |
| 关帝灵签 | `/lingqian` | 100支签文（真实数据） |
| 周公解梦 | `/dream` | 双体系解读（周公+弗洛伊德） |
| 祈福点灯 | `/pray` | 支付宝扫码付款流程 |
| 八字起名 | `/bazi` | 排盘+五行分析+起名推荐 |
| 登录 | `/login` | 模拟登录（localStorage） |
| 个人中心 | `/profile` | 功德记录 |
| logo预览 | `/logo-preview` | 4款头像选择 |
| 收款码预览 | `/qr-preview` | 收款码样式 |

## 工作流程

```
用户提需求 → AI改代码 → git push到GitHub → Cloudflare自动部署 → 网站更新
```

## 关键文件位置

- 灵签数据：`lib/lots-data.ts`（100支真实签文）
- 解梦数据：`lib/dream-data.ts`（20条梦境）
- 八字计算：`lib/bazi-utils.ts`
- 起名字库：`lib/naming-data.ts`
- 收款码图片：`public/alipay-qr.png`（含莲花logo）
- 4款logo：`public/logo-v1-lotus.png` 等

## 注意事项

- 支付宝收款码是"扫码转账"方案（个人收款，非商户支付）
- 所有专业数据（签文、梦境、起名）标注了"仅供娱乐参考"
- 推送代码用：`git -c http.sslVerify=false -c http.postBuffer=524288000 push`
- 国内网络访问 GitHub 不稳定，推送失败时多重试

## 设计风格

- 深色古典：背景 `#1a1410`，金色 `#D4AF77`
- 字体：Noto Serif SC（思源宋体）
- 响应式：桌面顶部导航 + 移动端底部Tab

## 更新日志

- 2026-06-17：项目创建完成，部署到 Cloudflare Pages 成功
