# 兰清堂 — 部署与配置指南

## 一、部署到 Cloudflare Pages

### 方法 A：Git 连接（推荐，自动部署）

1. **推送代码到 GitHub**
   ```bash
   cd lanqing-tang
   git init
   git add .
   git commit -m "兰清堂初始版本"
   git remote add origin https://github.com/你的用户名/lanqing-tang.git
   git push -u origin main
   ```

2. **在 Cloudflare 创建项目**
   - 登录 https://dash.cloudflare.com
   - 左侧菜单 → **Workers & Pages** → **创建应用程序** → **Pages** → **连接到 Git**
   - 选择你的 GitHub 仓库 `lanqing-tang`
   - 构建配置：
     ```
     框架预设：Next.js
     构建命令：npm run build
     输出目录：.next  （Cloudflare 会自动识别）
     ```
   - 环境变量（可选）：`NODE_VERSION = 20`
   - 点击 **保存并部署**

3. **等待部署完成**
   - Cloudflare 会自动构建
   - 完成后获得地址：`https://lanqing-tang.pages.dev`

### 方法 B：Wrangler CLI 手动部署

```bash
# 安装 wrangler
npm install -g wrangler

# 登录
wrangler login

# 构建项目
npm run build

# 部署
wrangler pages deploy .next --project-name lanqing-tang
```

### 绑定自定义域名

1. Cloudflare Dashboard → Pages → 你的项目 → **自定义域**
2. 添加域名（如 `lanqing.你的域名.com`）
3. 按提示添加 CNAME 记录即可

---

## 二、支付宝收款配置

### 步骤 1：获取支付宝收款码

1. 打开 **支付宝 App** → **收付款** → **二维码收款**
2. 保存你的收款二维码图片

### 步骤 2：放入项目

将收款码图片重命名为 `alipay-qr.png`，放到：
```
lanqing-tang/public/alipay-qr.png
```

这样祈福页面的扫码区域就会自动显示你的收款码。

### 步骤 3：（可选）配置支付宝跳转链接

如果你想点击按钮直接拉起支付宝付款：

1. 打开支付宝 App → 我的 → 收款 → 获取收款链接
2. 打开 `app/pray/page.tsx`
3. 找到这行：
   ```typescript
   const ALIPAY_LINK = "";
   ```
4. 改为你的链接：
   ```typescript
   const ALIPAY_LINK = "https://qr.alipay.com/你的收款码链接";
   ```

保存后页面上会出现 **"打开支付宝付款"** 按钮。

---

## 三、本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:3000
```

## 四、构建生产版本

```bash
npm run build
npm run start
```

---

## 五、目录结构说明

```
lanqing-tang/
├── app/
│   ├── layout.tsx          # 全局布局
│   ├── page.tsx            # 首页
│   ├── lingqian/page.tsx   # 关帝灵签
│   ├── dream/page.tsx      # 周公解梦
│   ├── pray/page.tsx       # 祈福点灯（含支付宝付款）
│   ├── bazi/page.tsx       # 八字起名
│   ├── login/page.tsx      # 登录
│   └── profile/page.tsx    # 个人中心
├── components/
│   ├── Navbar.tsx          # 顶部导航
│   └── BottomNav.tsx       # 移动端底部导航
├── lib/
│   ├── lots-data.ts        # 100支灵签数据
│   ├── dream-data.ts       # 解梦数据
│   ├── bazi-utils.ts       # 八字计算
│   ├── naming-data.ts      # 起名字库
│   └── supabase.ts         # Supabase 客户端
├── public/
│   ├── manifest.json       # PWA 配置
│   ├── icon.svg            # 应用图标
│   └── alipay-qr.png       # ← 你的支付宝收款码放这里
└── package.json
```

---

## 六、注意事项

1. **支付宝收款说明**：当前是"扫码转账"方案（个人收款），金额需用户手动输入。如需自动填金额，需申请支付宝商户支付接口。

2. **Supabase 后端**（可选）：如需启用用户系统和数据云端存储，在 Supabase 创建项目后，配置环境变量：
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
   ```

3. **专业数据替换**：
   - 灵签：已是完整 100 支（你提供的真实数据）
   - 解梦：当前 20 条，可扩充到 80+
   - 起名字库：当前示例数据，可替换为更专业的内容
