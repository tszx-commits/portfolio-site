// ===== 全局状态 =====
let portfolioData = null;
let currentImages = [];
let currentImageIndex = 0;

// ===== DOM 元素 =====
const app = document.getElementById('app');
const navbar = document.getElementById('navbar');
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const categoryDropdown = document.getElementById('category-dropdown');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxCaption = document.getElementById('lightbox-caption');

// ===== 初始化 =====
async function init() {
  try {
    showLoading();
    const response = await fetch('data/portfolio.json');
    if (!response.ok) throw new Error('Failed to load data');
    portfolioData = await response.json();

    applyTheme();
    renderNavigation();
    renderFooter();
    handleRoute();

    window.addEventListener('hashchange', handleRoute);
    navToggle.addEventListener('click', toggleMobileMenu);
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-dropdown') && !e.target.closest('.nav-toggle')) {
        navMenu.classList.remove('active');
      }
    });

    // 灯箱事件
    document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
    document.getElementById('lightbox-prev').addEventListener('click', showPrevImage);
    document.getElementById('lightbox-next').addEventListener('click', showNextImage);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrevImage();
      if (e.key === 'ArrowRight') showNextImage();
    });

    // 滚动时导航栏效果
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.3)';
      } else {
        navbar.style.boxShadow = 'none';
      }
    });

  } catch (error) {
    console.error('Init error:', error);
    app.innerHTML = `
      <div class="empty-state">
        <div class="icon">⚠️</div>
        <h3>数据加载失败</h3>
        <p>请检查 data/portfolio.json 文件是否存在且格式正确。</p>
      </div>
    `;
  }
}

// ===== 主题应用 =====
function applyTheme() {
  const theme = portfolioData.theme;
  const root = document.documentElement;
  root.style.setProperty('--primary', theme.primaryColor);
  root.style.setProperty('--secondary', theme.secondaryColor);
  root.style.setProperty('--bg', theme.backgroundColor);
  root.style.setProperty('--card-bg', theme.cardBackgroundColor);
  root.style.setProperty('--text', theme.textColor);
  root.style.setProperty('--text-muted', theme.mutedTextColor);
  root.style.setProperty('--font', theme.fontFamily);
}

// ===== 导航渲染 =====
function renderNavigation() {
  const categories = portfolioData.categories;
  categoryDropdown.innerHTML = categories.map(cat =>
    `<li><a href="#/category/${cat.id}"><span>${cat.icon}</span> ${cat.name}</a></li>`
  ).join('');

  document.getElementById('nav-logo').textContent = portfolioData.profile.name || 'Portfolio';
  document.title = `${portfolioData.profile.name} | 作品集`;
}

// ===== 页脚渲染 =====
function renderFooter() {
  const profile = portfolioData.profile;
  document.getElementById('footer-text').textContent = `© ${new Date().getFullYear()} ${profile.name}. All rights reserved.`;

  const links = profile.links || {};
  const footerLinks = document.getElementById('footer-links');
  footerLinks.innerHTML = Object.entries(links)
    .filter(([_, url]) => url && url !== '#')
    .map(([name, url]) => `<a href="${url}" target="_blank" rel="noopener">${name.charAt(0).toUpperCase() + name.slice(1)}</a>`)
    .join('');
}

// ===== 路由处理 =====
function handleRoute() {
  const hash = window.location.hash.slice(1) || '/';
  const parts = hash.split('/').filter(Boolean);

  // 更新导航激活状态
  document.querySelectorAll('.nav-link[data-route]').forEach(link => {
    link.classList.remove('active');
  });

  navMenu.classList.remove('active');

  if (parts.length === 0) {
    renderHome();
    setActiveNav('home');
  } else if (parts[0] === 'category' && parts[1]) {
    renderCategory(parts[1]);
  } else if (parts[0] === 'work' && parts[1]) {
    renderWorkDetail(parts[1]);
  } else if (parts[0] === 'about') {
    renderAbout();
    setActiveNav('about');
  } else {
    renderNotFound();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setActiveNav(route) {
  const link = document.querySelector(`.nav-link[data-route="${route}"]`);
  if (link) link.classList.add('active');
}

// ===== 加载状态 =====
function showLoading() {
  app.innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
      <p style="color: var(--text-muted);">加载中...</p>
    </div>
  `;
}

// ===== 首页 =====
function renderHome() {
  const profile = portfolioData.profile;
  const categories = portfolioData.categories;
  const works = portfolioData.works;

  const categoryCards = categories.map(cat => {
    const count = works.filter(w => w.category === cat.id).length;
    return `
      <div class="category-card" onclick="location.hash='#/category/${cat.id}'">
        <div class="category-icon">${cat.icon}</div>
        <div class="category-name">${cat.name}</div>
        <div class="category-count">${count} 个作品</div>
      </div>
    `;
  }).join('');

  const recentWorks = works.slice(0, 6);

  app.innerHTML = `
    <!-- Hero -->
    <section class="hero">
      <div class="container">
        <img src="${profile.avatar}" alt="${profile.name}" class="hero-avatar" onerror="this.src='https://api.dicebear.com/7.x/avataaars/svg?seed=portfolio'">
        <h1 class="hero-name">${profile.name}</h1>
        <p class="hero-title">${profile.title}</p>
        <p class="hero-bio">${profile.bio}</p>
        <div class="hero-contact">
          ${profile.email ? `<a href="mailto:${profile.email}" class="contact-btn primary">📧 联系我</a>` : ''}
          ${profile.links && profile.links.github ? `<a href="${profile.links.github}" target="_blank" class="contact-btn">🐙 GitHub</a>` : ''}
          <a href="#/about" class="contact-btn">👤 了解更多</a>
        </div>
      </div>
    </section>

    <!-- 分类 -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">作品分类</h2>
          <p class="section-subtitle">按领域浏览我的创作</p>
        </div>
        <div class="category-grid">${categoryCards}</div>
      </div>
    </section>

    <!-- 最新作品 -->
    <section class="section" style="padding-top: 0;">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">最新作品</h2>
          <p class="section-subtitle">精选近期项目</p>
        </div>
        <div class="works-grid">${recentWorks.map(renderWorkCard).join('')}</div>
      </div>
    </section>
  `;
}

// ===== 作品卡片 =====
function renderWorkCard(work) {
  const category = portfolioData.categories.find(c => c.id === work.category);
  const catName = category ? `${category.icon} ${category.name}` : work.category;

  return `
    <div class="work-card" onclick="location.hash='#/work/${work.id}'">
      <div class="work-cover-wrapper">
        <img src="${work.cover}" alt="${work.title}" class="work-cover" loading="lazy">
        <span class="work-category-badge">${catName}</span>
      </div>
      <div class="work-info">
        <h3 class="work-title">${work.title}</h3>
        <p class="work-desc">${work.description}</p>
        <div class="work-tags">
          ${(work.tags || []).map(tag => `<span class="work-tag">${tag}</span>`).join('')}
        </div>
        ${work.date ? `<div class="work-date">📅 ${work.date}</div>` : ''}
      </div>
    </div>
  `;
}

// ===== 分类页 =====
function renderCategory(categoryId) {
  const category = portfolioData.categories.find(c => c.id === categoryId);
  if (!category) { renderNotFound(); return; }

  const works = portfolioData.works.filter(w => w.category === categoryId);

  app.innerHTML = `
    <section class="section">
      <div class="container">
        <button class="back-btn" onclick="location.hash='#/'">← 返回首页</button>
        <div class="section-header">
          <h2 class="section-title">${category.icon} ${category.name}</h2>
          <p class="section-subtitle">共 ${works.length} 个作品</p>
        </div>
        ${works.length > 0
          ? `<div class="works-grid">${works.map(renderWorkCard).join('')}</div>`
          : `<div class="empty-state">
              <div class="icon">📂</div>
              <h3>暂无作品</h3>
              <p>这个分类下还没有作品，敬请期待。</p>
            </div>`
        }
      </div>
    </section>
  `;
}

// ===== 作品详情页 =====
function renderWorkDetail(workId) {
  const work = portfolioData.works.find(w => w.id === workId);
  if (!work) { renderNotFound(); return; }

  const category = portfolioData.categories.find(c => c.id === work.category);
  const catName = category ? `${category.icon} ${category.name}` : work.category;

  // 收集所有图片用于灯箱
  currentImages = (work.media || [])
    .filter(m => m.type === 'image')
    .map(m => ({ url: m.url, caption: m.caption || '' }));

  const mediaHtml = (work.media || []).map((m, idx) => {
    if (m.type === 'image') {
      const imgIdx = currentImages.findIndex(ci => ci.url === m.url);
      return `
        <div class="media-item">
          <img src="${m.url}" alt="${m.caption || work.title}" onclick="openLightbox(${imgIdx})">
          ${m.caption ? `<div class="media-caption">${m.caption}</div>` : ''}
        </div>
      `;
    } else if (m.type === 'video') {
      return `
        <div class="media-item">
          <video src="${m.url}" controls poster="${work.cover}"></video>
          ${m.caption ? `<div class="media-caption">${m.caption}</div>` : ''}
        </div>
      `;
    }
    return '';
  }).join('');

  const filesHtml = (work.files || []).map(f => `
    <div class="file-item">
      <div class="file-info">
        <span class="file-icon">📄</span>
        <div>
          <div class="file-name">${f.name}</div>
          ${f.size ? `<div class="file-size">${f.size}</div>` : ''}
        </div>
      </div>
      ${f.url && f.url !== '#'
        ? `<a href="${f.url}" download class="download-btn">下载</a>`
        : `<span style="color: var(--text-muted); font-size: 0.8rem;">暂不可下载</span>`
      }
    </div>
  `).join('');

  app.innerHTML = `
    <section class="work-detail">
      <div class="container">
        <button class="back-btn" onclick="history.back()">← 返回</button>

        <div class="detail-header">
          <h1 class="detail-title">${work.title}</h1>
          <div class="detail-meta">
            <span class="detail-category">${catName}</span>
            ${work.date ? `<span class="detail-date">📅 ${work.date}</span>` : ''}
          </div>
          <div class="work-tags" style="margin-bottom: 16px;">
            ${(work.tags || []).map(tag => `<span class="work-tag">${tag}</span>`).join('')}
          </div>
          <p class="detail-desc">${work.description}</p>
        </div>

        ${mediaHtml ? `<div class="detail-media">${mediaHtml}</div>` : ''}

        ${filesHtml ? `
          <div class="detail-files">
            <h3 class="files-title">📎 项目文件</h3>
            ${filesHtml}
          </div>
        ` : ''}
      </div>
    </section>
  `;
}

// ===== 关于我页面 =====
function renderAbout() {
  const profile = portfolioData.profile;
  const works = portfolioData.works;

  const socialLinks = Object.entries(profile.links || {})
    .filter(([_, url]) => url && url !== '#')
    .map(([name, url]) => {
      const icons = { github: '🐙', bilibili: '📺', artstation: '🎨', twitter: '🐦', linkedin: '💼', website: '🌐' };
      return `<a href="${url}" target="_blank" rel="noopener" class="social-link">${icons[name] || '🔗'} ${name.charAt(0).toUpperCase() + name.slice(1)}</a>`;
    }).join('');

  app.innerHTML = `
    <section class="about-section">
      <div class="container">
        <button class="back-btn" onclick="location.hash='#/'">← 返回首页</button>

        <div class="about-grid">
          <div class="about-avatar-col">
            <img src="${profile.avatar}" alt="${profile.name}" class="about-avatar" onerror="this.src='https://api.dicebear.com/7.x/avataaars/svg?seed=portfolio'">
            <h2 class="about-name">${profile.name}</h2>
            <p class="about-title">${profile.title}</p>
            <ul class="about-info-list">
              ${profile.email ? `<li><span class="icon">📧</span> ${profile.email}</li>` : ''}
              ${profile.phone ? `<li><span class="icon">📱</span> ${profile.phone}</li>` : ''}
              ${profile.location ? `<li><span class="icon">📍</span> ${profile.location}</li>` : ''}
              <li><span class="icon">🎨</span> ${works.length} 个作品</li>
            </ul>
          </div>

          <div class="about-content">
            <h2>关于我</h2>
            <p>${profile.bio}</p>
            <p>我专注于视觉创意领域，在特效制作、三维建模、AIGC 应用、视频剪辑和游戏开发等方向都有丰富的实践经验。每一个项目都是一次探索与成长，我致力于将技术与艺术完美结合，创造出令人印象深刻的视觉作品。</p>
            <p>如果你对我的作品感兴趣，或者有合作意向，欢迎随时联系我！</p>

            <h2 style="margin-top: 32px;">技能领域</h2>
            <div class="category-grid" style="margin-top: 20px;">
              ${portfolioData.categories.map(cat => {
                const count = works.filter(w => w.category === cat.id).length;
                return `
                  <div class="category-card" onclick="location.hash='#/category/${cat.id}'">
                    <div class="category-icon">${cat.icon}</div>
                    <div class="category-name">${cat.name}</div>
                    <div class="category-count">${count} 个作品</div>
                  </div>
                `;
              }).join('')}
            </div>

            ${socialLinks ? `
              <h2 style="margin-top: 32px;">找到我</h2>
              <div class="social-links">${socialLinks}</div>
            ` : ''}
          </div>
        </div>
      </div>
    </section>
  `;
}

// ===== 404 =====
function renderNotFound() {
  app.innerHTML = `
    <div class="empty-state" style="min-height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center;">
      <div class="icon" style="font-size: 4rem;">🔍</div>
      <h3 style="font-size: 1.5rem;">页面未找到</h3>
      <p>你访问的页面不存在或已被移除。</p>
      <button class="contact-btn primary" style="margin-top: 20px;" onclick="location.hash='#/'">返回首页</button>
    </div>
  `;
}

// ===== 灯箱 =====
function openLightbox(index) {
  if (index < 0 || index >= currentImages.length) return;
  currentImageIndex = index;
  updateLightboxImage();
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

function showPrevImage() {
  currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
  updateLightboxImage();
}

function showNextImage() {
  currentImageIndex = (currentImageIndex + 1) % currentImages.length;
  updateLightboxImage();
}

function updateLightboxImage() {
  const img = currentImages[currentImageIndex];
  lightboxImage.src = img.url;
  lightboxCaption.textContent = img.caption || '';
}

// ===== 移动端菜单 =====
function toggleMobileMenu() {
  navMenu.classList.toggle('active');
}

// ===== 启动 =====
init();
