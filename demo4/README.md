# 个人作品集网站使用指南

## 1. 启动服务器

### 方法一：使用Python命令（推荐）
1. 打开PowerShell或命令提示符
2. 进入项目目录：
   ```powershell
   cd D:\test\demo4
   ```
3. 启动服务器：
   ```powershell
   python -m http.server 8000
   ```
4. 打开浏览器访问：`http://localhost:8000`

### 方法二：使用启动脚本
1. 打开PowerShell
2. 进入项目目录：`cd D:\test\demo4`
3. 运行脚本：`.\start.ps1`

### 更改端口号
如果8000端口被占用，可以使用其他端口，例如：
```powershell
python -m http.server 9000  # 使用9000端口
```

## 2. 网站内容管理

### 2.1 添加图片
1. 在 `assets` 文件夹中添加图片
2. 图片命名建议使用英文，例如：`project1.jpg`
3. 在HTML中引用图片：
   ```html
   <img src="assets/project1.jpg" alt="项目预览图">
   ```

### 2.2 添加可下载文件
1. 创建 `downloads` 文件夹：
   ```powershell
   mkdir downloads
   ```
2. 将文件放入 `downloads` 文件夹
3. 在HTML中添加下载链接：
   ```html
   <a href="downloads/文件名.pdf" download>下载文档</a>
   ```

### 2.3 修改网页内容

#### 修改项目展示
在 `index.html` 中找到项目卡片部分：
```html
<div class="project-card" data-category="web">
    <div class="bg-gray-100 rounded-lg overflow-hidden">
        <img src="assets/项目图片.jpg" alt="项目预览">
        <div class="p-6">
            <h3 class="text-xl font-semibold mb-2">项目名称</h3>
            <p class="text-gray-600 mb-4">项目描述</p>
            <a href="#" class="text-blue-500 hover:text-blue-600">查看详情 →</a>
        </div>
    </div>
</div>
```

#### 修改个人信息
在 "关于我" 部分修改个人介绍：
```html
<div class="space-y-6">
    <p class="text-lg">在这里修改个人介绍...</p>
</div>
```

#### 修改技能展示
调整技能进度条：
```html
<div class="skill-progress" data-progress="90">
    <!-- 修改 data-progress 的值（0-100）来调整进度条 -->
</div>
```

## 3. 样式定制

### 3.1 修改颜色主题
在 `css/style.css` 中修改颜色变量：
```css
:root {
    --primary-color: #3B82F6;    /* 主色调 */
    --secondary-color: #1E40AF;  /* 次要色调 */
    --text-color: #1F2937;      /* 文字颜色 */
    --bg-color: #F3F4F6;        /* 背景色 */
}
```

### 3.2 修改布局
在 `index.html` 中：
- 使用 `container` 类控制内容宽度
- 使用 `grid` 和 `flex` 类调整布局
- 使用 `space-y-*` 和 `gap-*` 类调整间距

## 4. 进阶功能

### 4.1 添加新的项目类别
1. 在筛选按钮部分添加新类别：
   ```html
   <button onclick="filterProjects('新类别')" class="px-4 py-2 rounded-full bg-gray-200">
       新类别
   </button>
   ```
2. 为项目卡片添加对应类别：
   ```html
   <div class="project-card" data-category="新类别">
   ```

### 4.2 添加图片预览功能
项目已内置图片预览功能，只需要：
1. 为图片添加 `project-image` 类
2. 确保图片路径正确

### 4.3 添加联系表单功能
如需启用联系表单：
1. 创建后端处理程序（如PHP或Node.js）
2. 修改表单的action属性：
   ```html
   <form action="/submit" method="POST">
   ```

## 5. 故障排除

### 5.1 服务器启动问题
- 确保Python已安装
- 检查端口是否被占用
- 尝试使用不同的端口

### 5.2 页面显示问题
- 检查浏览器控制台是否有错误
- 确保所有文件路径正确
- 清除浏览器缓存

## 6. 部署到公网
如需让他人访问您的网站：
1. 购买域名和主机服务
2. 上传网站文件到主机
3. 配置域名解析

需要帮助或有任何问题，请随时联系我们。 