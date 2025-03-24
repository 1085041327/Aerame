/**
 * 组件加载模块
 * 用于动态加载HTML组件（导航栏和页脚）
 * 通过fetch请求加载HTML内容，并插入到页面指定位置
 * 加载完成后触发自定义事件，使其他模块可以在组件加载后执行相关功能
 */

/**
 * 加载导航栏组件
 * 从./components/navbar.html获取导航栏HTML内容
 * 并插入到body元素的最开始位置
 * 加载完成后触发navbarLoaded事件
 */
async function loadNavbar() {
    try {
        // 从组件目录获取导航栏HTML
        const response = await fetch('./components/navbar.html');
        if (!response.ok) {
            throw new Error(`加载导航栏失败: ${response.status}`);
        }
        const html = await response.text();
        
        // 找到body元素，将导航栏插入到body的开始位置
        const bodyElement = document.body;
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        
        // 逐个将临时div中的子元素添加到body的最前面
        while (tempDiv.firstChild) {
            bodyElement.insertBefore(tempDiv.firstChild, bodyElement.firstChild);
        }
        
        console.log('导航栏加载成功');
        
        // 触发导航栏加载完成事件，通知其他模块导航栏已加载
        const navbarLoadedEvent = new CustomEvent('navbarLoaded');
        document.dispatchEvent(navbarLoadedEvent);
    } catch (error) {
        console.error('加载导航栏出错:', error);
    }
}

/**
 * 加载页脚组件
 * 从./components/footer.html获取页脚HTML内容
 * 并插入到body元素的末尾位置
 * 如果当前页面是首页，则不加载页脚
 * 加载完成后触发footerLoaded事件
 */
async function loadFooter() {
    try {
        // 判断当前是否为首页，如果是首页则不加载页脚
        const currentPath = window.location.pathname;
        // 检查路径是否以index.html结尾或者是根路径
        if (currentPath.endsWith('index.html') || currentPath.endsWith('/') || currentPath.length === 0) {
            console.log('当前是首页，不加载页脚');
            // 即使不加载页脚也触发页脚加载完成事件，以维持一致的事件流
            const footerLoadedEvent = new CustomEvent('footerLoaded');
            document.dispatchEvent(footerLoadedEvent);
            return;
        }
        
        // 从组件目录获取页脚HTML
        const response = await fetch('./components/footer.html');
        if (!response.ok) {
            throw new Error(`加载页脚失败: ${response.status}`);
        }
        const html = await response.text();
        
        // 找到body元素，将页脚添加到body的末尾
        const bodyElement = document.body;
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        
        // 逐个将临时div中的子元素添加到body的最后面
        while (tempDiv.firstChild) {
            bodyElement.appendChild(tempDiv.firstChild);
        }
        
        console.log('页脚加载成功');
        
        // 触发页脚加载完成事件，通知其他模块页脚已加载
        const footerLoadedEvent = new CustomEvent('footerLoaded');
        document.dispatchEvent(footerLoadedEvent);
    } catch (error) {
        console.error('加载页脚出错:', error);
        // 即使加载失败也触发页脚加载完成事件，以维持一致的事件流
        const footerLoadedEvent = new CustomEvent('footerLoaded');
        document.dispatchEvent(footerLoadedEvent);
    }
}

/**
 * 页面加载完成时启动组件加载流程
 * 先加载导航栏，再加载页脚
 * 全部加载完成后触发componentsLoaded事件
 */
document.addEventListener('DOMContentLoaded', async () => {
    // 按顺序加载组件，确保导航栏先加载，页脚后加载
    await loadNavbar();
    await loadFooter();
    
    // 触发所有组件加载完成事件，表示页面组件已全部加载
    const componentsLoadedEvent = new CustomEvent('componentsLoaded');
    document.dispatchEvent(componentsLoadedEvent);
}); 