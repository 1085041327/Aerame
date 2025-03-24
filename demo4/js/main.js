/**
 * 主要功能模块
 * 负责页面通用功能的初始化和处理
 * 包括导航效果、技能进度条、图片预览、项目详情页效果和动画
 */

// 在页面加载完成后初始化所有功能
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();   // 初始化导航功能
    initializeSkillBars();    // 初始化技能条动画
    initializeLightbox();     // 初始化图片预览功能
    initializeProjectDetails(); // 初始化项目详情页效果
    initializeAnimations();   // 初始化页面动画效果
});

/**
 * 导航栏效果初始化
 * 处理导航栏背景变化和导航链接高亮
 */
function initializeNavigation() {
    const header = document.querySelector('header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    // 滚动监听，根据滚动位置改变导航栏样式和高亮当前区块
    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY;
        
        // 导航栏背景变化 - 滚动超过50px时添加白色背景和阴影
        if (scrollPos > 50) {
            header.classList.add('bg-white', 'shadow');
        } else {
            header.classList.remove('bg-white', 'shadow');
        }

        // 高亮当前可见区块对应的导航链接
        sections.forEach((section, index) => {
            // 计算每个区块的可见范围
            const top = section.offsetTop - 100;  // 顶部位置减去偏移量
            const bottom = top + section.offsetHeight; // 底部位置

            // 当滚动位置在区块范围内时，高亮对应导航链接
            if (scrollPos >= top && scrollPos < bottom) {
                // 移除所有导航链接的高亮
                navLinks.forEach(link => link.classList.remove('text-blue-500'));
                // 添加当前区块对应导航链接的高亮
                navLinks[index].classList.add('text-blue-500');
            }
        });
    });
}

/**
 * 技能进度条动画初始化
 * 当技能区域进入视口时，激活技能进度条动画
 */
function initializeSkillBars() {
    // 创建交叉观察器，监测元素进入视口
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // 当技能区域进入视口时
            if (entry.isIntersecting) {
                // 获取所有技能进度条
                const progressBars = entry.target.querySelectorAll('.skill-progress');
                // 为每个进度条设置宽度，触发动画
                progressBars.forEach(bar => {
                    const progress = bar.getAttribute('data-progress');
                    bar.style.width = progress + '%';
                });
            }
        });
    }, { threshold: 0.5 });  // 当50%的元素可见时触发

    // 获取技能区域元素并开始观察
    const skillsSection = document.querySelector('#skills');
    if (skillsSection) {
        observer.observe(skillsSection);
    }
}

/**
 * 项目筛选功能
 * 根据类别筛选和显示项目
 * @param {string} category 项目类别或'all'表示全部
 */
function filterProjects(category) {
    const projects = document.querySelectorAll('.project-card');
    const buttons = document.querySelectorAll('.space-x-4 button');

    // 更新筛选按钮样式 - 高亮当前选中按钮
    buttons.forEach(button => {
        if (button.textContent.toLowerCase().includes(category) || 
            (category === 'all' && button.textContent === '全部')) {
            // 高亮选中按钮
            button.classList.remove('bg-gray-200');
            button.classList.add('bg-blue-500', 'text-white');
        } else {
            // 取消其他按钮高亮
            button.classList.remove('bg-blue-500', 'text-white');
            button.classList.add('bg-gray-200');
        }
    });

    // 筛选并显示符合条件的项目
    projects.forEach(project => {
        if (category === 'all' || project.dataset.category === category) {
            // 显示符合条件的项目，并添加淡入动画
            project.style.display = 'block';
            project.classList.add('fade-in');
        } else {
            // 隐藏不符合条件的项目
            project.style.display = 'none';
        }
    });
}

/**
 * 图片预览功能初始化
 * 点击项目图片时创建全屏预览效果
 */
function initializeLightbox() {
    // 获取所有带预览功能的图片
    const images = document.querySelectorAll('.project-image');
    
    // 为每个图片添加点击事件
    images.forEach(image => {
        image.addEventListener('click', () => {
            // 创建预览模态框
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            
            // 创建图片容器
            const content = document.createElement('div');
            content.className = 'lightbox-content';
            
            // 创建并设置预览图片
            const img = document.createElement('img');
            img.src = image.src;
            img.alt = image.alt;
            
            // 组装预览模态框
            content.appendChild(img);
            lightbox.appendChild(content);
            document.body.appendChild(lightbox);
            
            // 添加关闭按钮
            const closeButton = document.createElement('button');
            closeButton.className = 'absolute top-4 right-4 text-white hover:text-gray-300';
            closeButton.innerHTML = `
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            `;
            lightbox.appendChild(closeButton);
            
            // 使用requestAnimationFrame确保DOM更新后再添加动画类
            requestAnimationFrame(() => {
                lightbox.classList.add('active');
            });
            
            // 关闭预览的函数
            const closeLightbox = () => {
                // 移除激活类触发关闭动画
                lightbox.classList.remove('active');
                // 动画结束后移除元素
                setTimeout(() => {
                    lightbox.remove();
                }, 300);
            };
            
            // 点击关闭按钮时关闭预览
            closeButton.addEventListener('click', closeLightbox);
            
            // 点击预览背景时关闭预览
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    closeLightbox();
                }
            });
            
            // 按ESC键关闭预览
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    closeLightbox();
                }
            });
        });
    });
}

/**
 * 项目详情页面效果初始化
 * 为项目详情页添加入场动画
 */
function initializeProjectDetails() {
    // 获取项目详情内容元素
    const projectContent = document.querySelector('.project-details');
    if (projectContent) {
        // 添加初始状态类
        projectContent.classList.add('project-details-enter');
        // 下一帧添加激活状态类，触发动画
        requestAnimationFrame(() => {
            projectContent.classList.add('project-details-enter-active');
        });
    }
}

/**
 * 页面动画效果初始化
 * 为页面元素添加滚动时的淡入动画
 */
function initializeAnimations() {
    // 创建交叉观察器，监测元素进入视口
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 元素进入视口时添加淡入动画
                entry.target.classList.add('fade-in');
                // 动画只触发一次，之后停止观察
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,           // 10%可见时触发
        rootMargin: '0px 0px -50px 0px'  // 底部偏移，提前触发动画
    });

    // 获取需要添加动画的元素并开始观察
    const animateElements = document.querySelectorAll('.project-card, .section-title, .skill-bar');
    animateElements.forEach(element => {
        observer.observe(element);
    });
}

// 导出项目筛选函数，供全局使用
window.filterProjects = filterProjects; 