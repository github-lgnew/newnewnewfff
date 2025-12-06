# Vercel 部署 404 问题修复指南

## 问题原因

Vercel 显示 404 通常是因为：
1. 缺少路由配置（SPA应用需要重写所有路由到 index.html）
2. 路径使用了相对路径（`./`）而不是绝对路径（`/`）

## ✅ 已修复的内容

我已经创建并修复了以下文件：

### 1. 创建了 `vercel.json` 配置文件
- 配置了路由重写规则，所有请求都指向 `index.html`
- 配置了 Service Worker 的响应头
- 添加了安全响应头

### 2. 修复了路径问题
- `manifest.json`: `start_url` 和 `scope` 改为绝对路径
- `service-worker.js`: 缓存URL改为绝对路径
- `app.js`: Service Worker 注册路径改为绝对路径

## 📋 下一步操作

### 方法一：重新部署（推荐）

1. **提交所有更改到 Git**
   ```bash
   git add .
   git commit -m "修复Vercel部署配置"
   git push
   ```

2. **Vercel 会自动重新部署**
   - Vercel 检测到代码更新后会自动重新部署
   - 等待部署完成（通常1-2分钟）

3. **访问你的域名**
   - 应该可以正常访问了

### 方法二：在 Vercel 控制台重新部署

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 找到你的项目
3. 点击 "Redeploy" 按钮
4. 等待部署完成

## 🔍 验证部署

部署成功后，检查以下几点：

### 1. 访问首页
- 访问你的域名（如：`https://your-app.vercel.app`）
- 应该能看到应用界面，而不是 404

### 2. 检查浏览器控制台
- 按 F12 打开开发者工具
- 查看 Console 标签
- 应该看到 "Service Worker 注册成功" 的消息
- 不应该有红色错误信息

### 3. 检查 Network 标签
- 刷新页面
- 检查所有资源（HTML、CSS、JS）是否都返回 200 状态码
- 不应该有 404 错误

## 🐛 如果还有问题

### 检查文件是否都在根目录

确保你的项目结构是这样的：
```
travel-budget-app/
├── index.html          ✅ 必须在
├── styles.css          ✅ 必须在
├── app.js              ✅ 必须在
├── data.js             ✅ 必须在
├── manifest.json       ✅ 必须在
├── service-worker.js   ✅ 必须在
├── vercel.json         ✅ 必须有（新创建的）
└── icon-192.png        ⚠️  可选（有的话更好）
└── icon-512.png        ⚠️  可选（有的话更好）
```

### 检查 Vercel 部署日志

1. 在 Vercel Dashboard 中打开项目
2. 点击 "Deployments"
3. 查看最新的部署日志
4. 检查是否有构建错误

### 清除浏览器缓存

1. 按 Ctrl+Shift+Delete（Windows）或 Cmd+Shift+Delete（Mac）
2. 清除缓存和 Cookie
3. 重新访问网站

### 检查 Vercel 项目设置

1. 在 Vercel Dashboard 打开项目
2. 进入 Settings → General
3. 确认：
   - **Root Directory**: 应该是 `travel-budget-app`（如果你的项目在子文件夹）或留空（如果在根目录）
   - **Build Command**: 留空（静态网站不需要构建）
   - **Output Directory**: 留空或设置为 `.`（当前目录）

## 📝 常见问题

### Q: 为什么需要 vercel.json？
**A:** Vercel 默认不处理 SPA（单页应用）的路由，需要配置文件告诉它把所有路由都指向 index.html。

### Q: 路径为什么要用 `/` 而不是 `./`？
**A:** 在部署到服务器后，相对路径可能会出错。绝对路径 `/` 从域名根目录开始，更可靠。

### Q: Service Worker 注册失败怎么办？
**A:** 
- 确保在 HTTPS 环境下（Vercel 自动提供 HTTPS）
- 检查 `service-worker.js` 文件是否存在
- 查看浏览器控制台的错误信息

### Q: 图标显示不出来？
**A:** 
- 确保 `icon-192.png` 和 `icon-512.png` 文件存在
- 如果暂时没有图标，可以先用纯色图片代替
- 应用功能不受影响，只是图标会显示默认样式

## ✅ 部署成功后的检查清单

- [ ] 首页可以正常访问
- [ ] 四个页面（记账、旅游、记事本、设置）可以切换
- [ ] 数据可以保存（localStorage）
- [ ] 定位功能可以工作（需要授权）
- [ ] Service Worker 已注册（控制台可以看到消息）
- [ ] 可以添加到主屏幕（PWA功能）

---

如果按照以上步骤操作后仍有问题，请检查：
1. Vercel 部署日志中的错误信息
2. 浏览器控制台的具体错误
3. Network 标签中哪个文件返回了 404

