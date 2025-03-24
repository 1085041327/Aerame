/**
 * 导航栏相关功能模块
 * 用于控制导航栏的滚动效果和联系方式弹窗
 * 实现导航栏滚动隐藏/显示、联系方式弹窗的打开/关闭
 */

/**
 * 初始化导航栏所有功能
 * 作为入口函数调用子函数
 */
function initializeNavbar() {
    initializeScrollEffect();
    initializeContactModal();
    initializeMobileMenu(); // 添加初始化移动端菜单功能
}

/**
 * 初始化导航栏滚动效果
 * 实现向下滚动时隐藏导航栏、向上滚动时显示导航栏的效果
 */
function initializeScrollEffect() {
    const header = document.querySelector('header');
    if (!header) return; // 如果导航栏还未加载，则直接返回
    
    let lastScrollY = window.scrollY;  // 记录上次滚动位置
    let ticking = false;               // 节流标志，防止过度触发
    const SCROLL_THRESHOLD = 50;       // 滚动阈值，超过此值才触发隐藏

    // 初始显示导航栏
    header.classList.add('nav-show');

    // 监听窗口滚动事件
    window.addEventListener('scroll', () => {
        if (!ticking) {
            // 使用requestAnimationFrame优化性能
            window.requestAnimationFrame(() => {
                const currentScrollY = window.scrollY;
                
                // 向下滚动超过阈值时隐藏导航栏
                if (currentScrollY > lastScrollY && currentScrollY > SCROLL_THRESHOLD) {
                    header.classList.add('nav-hide');
                    header.classList.remove('nav-show');
                } 
                // 向上滚动或在顶部附近时显示导航栏
                else if (currentScrollY < lastScrollY || currentScrollY <= SCROLL_THRESHOLD) {
                    header.classList.remove('nav-hide');
                    header.classList.add('nav-show');
                }

                lastScrollY = currentScrollY;  // 更新上次滚动位置
                ticking = false;               // 重置节流标志
            });

            ticking = true;  // 设置节流标志
        }
    });
}

/**
 * 初始化移动端菜单功能
 * 实现点击汉堡菜单按钮时展开/收起水平导航菜单
 * 适配各种屏幕尺寸，包括PC端小屏幕
 */
function initializeMobileMenu() {
    console.log('初始化移动端菜单...');
    
    // 获取移动端菜单按钮和菜单元素
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuIcon = document.getElementById('menuIcon');
    const closeIcon = document.getElementById('closeIcon');
    const mobileContactBtn = document.getElementById('mobileContactBtn');
    
    // 如果元素不存在，说明导航栏尚未加载，直接返回
    if (!mobileMenuBtn || !mobileMenu) {
        console.log('移动端菜单按钮或菜单未找到，正在等待导航栏加载...');
        return;
    }
    
    console.log('找到移动端菜单元素，准备初始化...');
    
    // 获取所有移动端导航链接
    const mobileNavLinks = mobileMenu.querySelectorAll('.mobile-nav-link');
    console.log(`找到 ${mobileNavLinks.length} 个移动端导航链接`);
    
    // 移动端菜单的打开/关闭状态
    let isMenuOpen = false;
    
    // 预先检查窗口宽度，确定适用的样式类型
    const updateMenuStyle = () => {
        const windowWidth = window.innerWidth;
        console.log(`屏幕宽度: ${windowWidth}px`);
        
        if (windowWidth <= 380) {
            mobileMenu.classList.add('xs-screen');
            console.log('应用超小屏幕样式');
        } else if (windowWidth <= 450) {
            mobileMenu.classList.remove('xs-screen');
            mobileMenu.classList.add('sm-screen');
            console.log('应用小屏幕样式');
        } else {
            mobileMenu.classList.remove('xs-screen', 'sm-screen');
            console.log('应用标准屏幕样式');
        }
    };
    
    // 初始检查并设置样式
    updateMenuStyle();
    
    // 切换移动端菜单的显示/隐藏
    const toggleMobileMenu = () => {
        console.log(`切换菜单状态: ${isMenuOpen ? '关闭' : '打开'}`);
        isMenuOpen = !isMenuOpen;
        
        if (isMenuOpen) {
            // 显示菜单容器
            mobileMenu.classList.remove('hidden');
            console.log('菜单容器显示');
            
            // 添加短暂延迟确保DOM更新
            setTimeout(() => {
                // 激活菜单容器显示动画
                mobileMenu.classList.add('active');
                
                // 激活汉堡按钮样式（添加蓝色光晕）
                mobileMenuBtn.classList.add('active');
                console.log('激活菜单按钮样式');
                
                // 切换图标（显示关闭图标）
                menuIcon.classList.add('hidden');
                menuIcon.classList.remove('block');
                closeIcon.classList.add('block');
                closeIcon.classList.remove('hidden');
                
                // 依次显示各个链接（统一动画效果）
                mobileNavLinks.forEach((link, index) => {
                    setTimeout(() => {
                        link.classList.add('active');
                    }, index * 50); // 使用较小的延迟，保持流畅的入场效果
                });
            }, 10);
        } else {
            // 隐藏菜单的动画
            mobileMenu.classList.remove('active');
            console.log('移除菜单容器激活样式');
            
            // 移除汉堡按钮的激活样式（移除蓝色光晕）
            mobileMenuBtn.classList.remove('active');
            
            // 反向切换图标（显示菜单图标）
            closeIcon.classList.add('hidden');
            closeIcon.classList.remove('block');
            menuIcon.classList.add('block');
            menuIcon.classList.remove('hidden');
            
            // 同步移除链接的激活状态，保持一致的退场效果
            mobileNavLinks.forEach((link, index) => {
                setTimeout(() => {
                    link.classList.remove('active');
                }, index * 50); // 使用与入场相同的延迟，保持一致性
            });
            
            // 等待动画完成后隐藏菜单容器
            setTimeout(() => {
                mobileMenu.classList.add('hidden');
                console.log('隐藏菜单容器');
            }, 400); // 适当缩短时间使体验更流畅
        }
    };
    
    // 点击汉堡菜单按钮时切换菜单显示/隐藏
    mobileMenuBtn.addEventListener('click', (e) => {
        console.log('菜单按钮被点击');
        e.stopPropagation(); // 阻止事件冒泡，防止立即被window点击事件处理
        toggleMobileMenu();
    });
    
    // 为汉堡按钮添加键盘访问性
    mobileMenuBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMobileMenu();
        }
    });
    
    // 如果移动端联系方式按钮存在，添加点击事件处理
    if (mobileContactBtn) {
        mobileContactBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // 阻止事件冒泡
            console.log('移动端联系方式按钮被点击');
            
            // 先关闭移动端菜单
            if (isMenuOpen) {
                toggleMobileMenu();
            }
            
            // 延迟一下再打开联系方式弹窗，等菜单关闭动画完成
            setTimeout(() => {
                // 触发联系方式弹窗打开
                const contactModal = document.getElementById('contactModal');
                const modalContent = contactModal.querySelector('.bg-white');
                
                contactModal.classList.remove('hidden');
                contactModal.classList.add('flex');
                console.log('显示联系方式弹窗');
                
                setTimeout(() => {
                    modalContent.classList.remove('scale-95', 'opacity-0');
                    modalContent.classList.add('scale-100', 'opacity-100');
                }, 10);
            }, 400); // 延长等待时间，与菜单关闭动画匹配
        });
    }
    
    // 为每个导航链接添加平滑的交互效果
    mobileNavLinks.forEach(link => {
        // 除联系方式按钮外的其他链接
        if (link.id !== 'mobileContactBtn') {
            link.addEventListener('click', (e) => {
                e.stopPropagation(); // 阻止事件冒泡
                
                // 添加点击反馈动画
                link.classList.add('clicked');
                setTimeout(() => {
                    link.classList.remove('clicked');
                }, 300);
                
                console.log(`导航链接被点击: ${link.textContent}`);
                
                // 适当延迟后关闭菜单，使用户感觉到交互反馈
                setTimeout(() => {
                    if (isMenuOpen) {
                        toggleMobileMenu();
                    }
                }, 100);
            });
        }
    });
    
    // 点击窗口其他区域时关闭菜单
    window.addEventListener('click', (e) => {
        if (isMenuOpen && 
            !mobileMenu.contains(e.target) && 
            !mobileMenuBtn.contains(e.target)) {
            console.log('点击窗口其他区域，关闭菜单');
            toggleMobileMenu();
        }
    });
    
    // 监听窗口大小变化，以适应不同屏幕尺寸
    window.addEventListener('resize', () => {
        const prevWidth = window.innerWidth;
        
        // 使用requestAnimationFrame减少不必要的样式更新
        requestAnimationFrame(() => {
            if (prevWidth !== window.innerWidth) {
                updateMenuStyle();
                
                // 如果菜单是打开的，根据屏幕变化调整其显示
                if (isMenuOpen) {
                    console.log('屏幕尺寸变化，调整菜单布局');
                    // 在某些情况下可能需要重新打开菜单以应用新的样式
                    if (Math.abs(prevWidth - window.innerWidth) > 50) {
                        mobileMenu.classList.add('resizing'); // 添加标志防止动画冲突
                        toggleMobileMenu(); // 关闭
                        setTimeout(() => {
                            mobileMenu.classList.remove('resizing'); // 移除标志
                            toggleMobileMenu(); // 重新打开
                        }, 450);
                    }
                }
            }
        });
    });
    
    // 为菜单添加CSS类以添加点击反馈动画样式
    const style = document.createElement('style');
    style.textContent = `
        .mobile-nav-link.clicked {
            transform: scale(0.95);
            transition: transform 0.1s ease;
        }
        .mobile-links-container.resizing {
            transition: none !important;
        }
        .mobile-links-container.resizing * {
            transition: none !important;
        }
    `;
    document.head.appendChild(style);
    
    console.log('移动端菜单初始化完成');
}

/**
 * 初始化联系方式弹窗功能
 * 实现点击联系方式按钮打开弹窗，以及关闭弹窗的多种方式
 */
function initializeContactModal() {
    // 获取联系方式按钮和弹窗元素
    const contactBtn = document.getElementById('contactBtn');
    const contactModal = document.getElementById('contactModal');
    
    // 如果元素不存在，说明导航栏尚未加载，直接返回
    if (!contactBtn || !contactModal) {
        console.log('联系方式按钮或弹窗未找到，正在等待导航栏加载...');
        return;
    }
    
    const closeModal = document.getElementById('closeModal');
    const modalContent = contactModal.querySelector('.bg-white');

    // 点击"联系方式"按钮时显示弹窗
    contactBtn.addEventListener('click', (e) => {
        e.preventDefault();  // 阻止默认链接行为
        console.log('联系方式按钮被点击'); // 调试输出
        
        // 显示弹窗容器
        contactModal.classList.remove('hidden');
        contactModal.classList.add('flex');
        
        // 添加短暂延迟后显示内容，实现淡入效果
        setTimeout(() => {
            modalContent.classList.remove('scale-95', 'opacity-0');
            modalContent.classList.add('scale-100', 'opacity-100');
        }, 10);

        // 添加按钮点击动画效果 - 按钮缩小后恢复
        contactBtn.classList.add('scale-95');
        setTimeout(() => {
            contactBtn.classList.remove('scale-95');
        }, 200);
    });

    // 关闭弹窗功能 - 抽取为公共函数便于多处调用
    const closeModalFunction = () => {
        // 先缩小和淡出内容
        modalContent.classList.add('scale-95', 'opacity-0');
        modalContent.classList.remove('scale-100', 'opacity-100');
        
        // 延迟后隐藏整个弹窗容器，等待动画完成
        setTimeout(() => {
            contactModal.classList.add('hidden');
            contactModal.classList.remove('flex');
        }, 300);
    };

    // 点击关闭按钮关闭弹窗
    closeModal.addEventListener('click', closeModalFunction);
    
    // 点击弹窗外部区域关闭弹窗
    contactModal.addEventListener('click', (e) => {
        // 仅当点击的是弹窗背景而非内容时关闭
        if (e.target === contactModal) {
            closeModalFunction();
        }
    });

    // 按ESC键关闭弹窗
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !contactModal.classList.contains('hidden')) {
            closeModalFunction();
        }
    });
    
    console.log('联系方式弹窗初始化完成');
}

// 监听导航栏加载完成事件
document.addEventListener('navbarLoaded', () => {
    console.log('导航栏加载完成事件触发，初始化导航栏功能');
    initializeNavbar();  // 当导航栏加载完成后初始化功能
});

// 当文档加载完成时，检查是否需要初始化导航栏
document.addEventListener('DOMContentLoaded', () => {
    // 如果导航栏已经加载，则立即初始化
    if (document.getElementById('contactBtn')) {
        console.log('页面加载时发现导航栏已存在，直接初始化');
        initializeNavbar();
    } else {
        console.log('页面加载时导航栏尚未加载，等待navbarLoaded事件');
        // 此时等待navbarLoaded事件触发
    }
}); 