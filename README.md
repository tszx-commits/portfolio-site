# 个人作品集网站

一个纯静态的个人作品集网站，无需后端，可直接部署到 GitHub Pages。

## 功能特性

- 🎨 **五大作品分类**：特效、三维建模、AIGC、剪辑、游戏制作
- 📝 **数据驱动**：所有内容通过 `data/portfolio.json` 配置，无需改代码
- 🎭 **主题可定制**：颜色、字体等通过 JSON 配置
- 🖼️ **图片灯箱**：点击图片可放大查看，支持左右切换
- 🎬 **视频播放**：支持在线视频播放
- 📎 **文件下载**：作品可附带项目文件供下载
- 📱 **响应式设计**：适配手机、平板、桌面
- ⚡ **纯静态**：零后端依赖，加载速度快

## 文件结构

```
portfolio-static/
├── index.html          # 主页面
├── css/
│   └── style.css       # 样式文件
├── js/
│   └── app.js          # 前端逻辑
├── data/
│   └── portfolio.json  # 【重要】所有内容配置文件
├── assets/             # 可放置本地图片/视频/文件
└── README.md           # 说明文档
```

## 快速开始

### 1. 编辑内容

打开 `data/portfolio.json`，修改以下内容：

#### 个人简介（profile）
```json
{
  "name": "你的名字",
  "title": "你的职业头衔",
  "avatar": "头像图片URL",
  "bio": "个人简介文字",
  "email": "邮箱",
  "phone": "电话",
  "location": "所在地",
  "links": {
    "github": "GitHub链接",
    "bilibili": "B站链接",
    "artstation": "ArtStation链接"
  }
}
```

#### 主题配置（theme）
```json
{
  "primaryColor": "#6366f1",      // 主色调
  "secondaryColor": "#8b5cf6",    // 辅助色
  "backgroundColor": "#0f0f1a",   // 背景色
  "cardBackgroundColor": "#1a1a2e", // 卡片背景色
  "textColor": "#e2e8f0",         // 文字颜色
  "mutedTextColor": "#94a3b8",    // 次要文字颜色
  "fontFamily": "'Inter', sans-serif" // 字体
}
```

#### 添加作品（works）
每个作品包含：
```json
{
  "id": "work-001",              // 唯一ID，英文/数字
  "title": "作品标题",
  "category": "vfx",              // 分类ID：vfx/3d/aigc/editing/game
  "cover": "封面图URL",
  "description": "作品描述",
  "tags": ["标签1", "标签2"],
  "date": "2024-03",
  "media": [
    { "type": "image", "url": "图片URL", "caption": "图片说明" },
    { "type": "video", "url": "视频URL", "caption": "视频说明" }
  ],
  "files": [
    { "name": "文件名.zip", "url": "文件URL", "size": "256MB" }
  ]
}
```

**分类ID对应关系：**
- `vfx` → 特效
- `3d` → 三维建模
- `aigc` → AIGC
- `editing` → 剪辑
- `game` → 游戏制作

### 2. 本地预览

由于使用了 `fetch` 加载 JSON 文件，需要通过本地服务器预览：

**方法一：Python（推荐）**
```bash
cd portfolio-static
python3 -m http.server 8000
```
然后访问 http://localhost:8000

**方法二：Node.js**
```bash
npx serve portfolio-static
```

**方法三：VS Code**
安装 Live Server 插件，右键 index.html → Open with Live Server

## 部署到 GitHub Pages

### 方法一：通过 GitHub 网页操作（最简单）

1. **创建仓库**
   - 登录 GitHub，点击右上角 `+` → `New repository`
   - 仓库名建议：`portfolio`（或任意名称）
   - 选择 `Public`（公开，Pages 免费）
   - 勾选 `Add a README file`
   - 点击 `Create repository`

2. **上传文件**
   - 进入仓库页面，点击 `Add file` → `Upload files`
   - 将 `portfolio-static` 文件夹内的**所有文件**（不是文件夹本身）拖拽上传
   - 包括：`index.html`、`css/`、`js/`、`data/`、`assets/`
   - 点击 `Commit changes`

3. **开启 GitHub Pages**
   - 进入仓库 `Settings` → 左侧 `Pages`
   - `Source` 选择 `Deploy from a branch`
   - `Branch` 选择 `main`，文件夹选择 `/ (root)`
   - 点击 `Save`
   - 等待 1-2 分钟，页面上方会显示你的网站地址：
     `https://你的用户名.github.io/仓库名/`

### 方法二：通过 Git 命令行

```bash
# 1. 进入项目目录
cd portfolio-static

# 2. 初始化 Git
git init
git add .
git commit -m "Initial commit"

# 3. 关联远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/你的用户名/portfolio.git
git branch -M main
git push -u origin main

# 4. 在 GitHub 仓库 Settings → Pages 中开启 Pages
```

### 部署后注意事项

- 如果你的仓库名不是根域名（即 URL 带 `/仓库名/`），网站已使用相对路径，无需额外配置
- 每次修改 `portfolio.json` 后，提交到 GitHub，约 1 分钟后网站自动更新
- 图片/视频建议使用图床或 CDN 链接，避免仓库过大

## 图片/视频资源建议

### 图床推荐（免费）
- **GitHub 本身**：将图片放到 `assets/` 目录，用相对路径 `assets/xxx.jpg`
- **SM.MS**：https://sm.ms/
- **Imgur**：https://imgur.com/
- **七牛云**：有免费额度

### 视频托管
- **B站**：上传后获取嵌入链接
- **YouTube**：获取嵌入链接
- 直接将视频文件放入 `assets/` 目录（注意 GitHub 仓库单文件限制 100MB）

## 常见问题

**Q: 本地打开 index.html 页面空白？**
A: 因为使用 fetch 加载 JSON，必须通过本地服务器访问，不能直接双击打开。参考上方"本地预览"。

**Q: 部署后图片不显示？**
A: 检查图片 URL 是否可公开访问，建议使用 HTTPS 链接。如果用本地 assets 路径，确保文件已上传到 GitHub。

**Q: 如何修改分类名称？**
A: 在 `portfolio.json` 的 `categories` 数组中修改对应分类的 `name` 和 `icon`。

**Q: 可以添加更多分类吗？**
A: 可以，在 `categories` 中添加新分类，然后在作品中使用对应的 `id`。

**Q: 视频无法播放？**
A: 确保视频格式为 MP4（H.264 编码）或 WebM，这是浏览器通用支持的格式。

## 技术栈

- 原生 HTML5 + CSS3 + JavaScript（ES6+）
- 无框架依赖，无构建步骤
- HashRouter 实现单页应用路由
- CSS 变量实现主题切换

---

**享受你的作品集网站！** 🎉
