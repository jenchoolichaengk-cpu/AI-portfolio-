# Portfolio AI / Vercel 部署说明

## 部署方式

本项目是 Next.js App Router 的纯前端静态导出项目，保留 `output: 'export'`。构建生成 `out/`，Vercel 托管其中的 HTML、CSS、JavaScript 和图片。无需运行时后端、数据库、AI API Key 或业务环境变量。

将源码仓库导入 Vercel，使用以下设置：

| 设置 | 值 |
| --- | --- |
| Framework Preset | Next.js |
| Root Directory | 包含 package.json 的项目根目录 |
| Node.js | 24.x |
| Install Command | npx --yes pnpm@10.11.0 install --frozen-lockfile |
| Build Command | npm run build |
| Output Directory | out |
| 环境变量 | 无需配置 |

构建、安装和输出目录已写入 `vercel.json`。`package.json` 同时固定 Node.js 主版本和 pnpm 版本。安装命令显式使用相同 pnpm 版本，不依赖 Corepack 开关或 Vercel 对锁文件的默认版本推断。必须提交 `pnpm-lock.yaml`，不要混入其他包管理器的锁文件。

## 公网访问

部署完成后分享 Production 域名，而不是 `localhost`、本机路径或仅自己可访问的 Preview 地址。检查 Vercel 项目的 Deployment Protection，确保 Production 域名不要求 Vercel 登录或密码。用未登录的隐私窗口验证后，再分享给面试官。项目本身没有登录限制，Vercel 账户层的访问限制不能由前端源码解除。

## 应上传的文件

部署完整源码：`app/`、`components/`、`lib/`、`public/`、`scripts/`，以及根目录的 package.json、pnpm-lock.yaml、Next.js、TypeScript、PostCSS 和 Vercel 配置。不要把 `outputs/portfolio-ai/index.html` 当作这个 Next.js 项目的源码入口。

`node_modules/`、`.next/`、`out/`、`work/`、`outputs/` 和旧的 `.openai/` Sites 元数据无需上传。`.vercelignore` 已排除本地临时文件和旧平台元数据。Git 集成仍应保持仓库干净；`.vercelignore` 主要控制 CLI 上传范围。

## 本地构建与预览

```sh
npx --yes pnpm@10.11.0 install --frozen-lockfile
npx --yes pnpm@10.11.0 run typecheck
npm run build
npm start
```

打开 `http://localhost:3000`。如果端口已占用：

```sh
npm start -- --port 3002
```

`start` 仅用于本地查看已构建的静态文件，Vercel 不需要执行它。静态导出不使用 `next start`。不要同时用同一目录运行 `next dev` 和 `next build`，它们共享 `.next/`。

## 已核对的项目约束

- `/kitchen.png` 和 `/favicon.svg` 对应 `public/` 内文件；部署到域名根路径即可加载，未依赖 Windows 文件路径、localhost 服务或图片外链。
- 浏览器 API 在客户端 effect 或事件处理器中执行，可完成构建期预渲染。
- 所有工作流以 React 客户端状态切换，不需要服务器路由重写。刷新回到首页是现有行为。
- AI 分析和聊天仍为 Mock Data；上传只读取文件元数据，不解析、上传或保存文件内容到服务器。
- 草稿保存于当前浏览器、当前域名的 localStorage，不跨设备同步。Production 与 Preview 域名的草稿互不共享。
- Recharts 2.x 已被上游标记为旧分支，但当前锁定版本可构建；为保持现有 UI 和交互，本次未进行大版本升级。
- 页面、样式、组件、图片和 mock 数据均未修改。

## 实际技术栈（锁文件版本）

| 用途 | 技术 |
| --- | --- |
| 框架 | Next.js 15.5.25 / App Router / Static Export |
| 界面 | React + React DOM 19.3.0 |
| 类型 | TypeScript 5.9.3 |
| 样式 | Tailwind CSS + @tailwindcss/postcss 4.3.3；自定义 CSS |
| UI 基础 | 本地 shadcn/ui 风格组件，基于 Radix Dialog 1.1.23、Tabs 1.1.21、Slot 1.3.3 |
| 图标 | Lucide React 0.468.0 |
| 动画 | Framer Motion 12.43.0 |
| 图表 | Recharts 2.15.4 |
| 状态与存储 | React Hooks + 浏览器 localStorage |
| 测试 | Playwright 1.63.0 |
| 部署工具 | Node.js 24.x + pnpm 10.11.0 |

## 官方参考

- [Next.js 静态导出](https://nextjs.org/docs/app/guides/static-exports)
- [Vercel 包管理器](https://vercel.com/docs/package-managers)
- [Vercel Node.js 版本](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions)
- [Vercel 访问保护](https://vercel.com/docs/deployment-protection/methods-to-protect-deployments/vercel-authentication)
