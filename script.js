// 初始化语言设置
let currentLang = navigator.language.startsWith('zh') ? 'zh' : 'en';

// 语言映射
const langMap = {
  'zh': 'zh-cn',
  'en': 'en'
};

// 加载内容
async function loadContent(lang) {
  try {
    const response = await fetch(`content/${langMap[lang]}.md`);
    if (!response.ok) throw new Error('Failed to load content');
    const markdown = await response.text();
    renderContent(markdown);
    updateLanguageSwitcher(lang);
  } catch (error) {
    console.error('Error loading content:', error);
  }
}

// 渲染内容
function renderContent(markdown) {
  const contentDiv = document.getElementById('content');
  contentDiv.innerHTML = marked.parse(markdown);
  generateNavigation();
}

// 生成导航菜单
function generateNavigation() {
  const nav = document.querySelector('.main-nav ul');
  const headings = document.querySelectorAll('#content h2');
  
  nav.innerHTML = '';
  
  headings.forEach(heading => {
    // 为每个标题生成唯一ID
    if (!heading.id) {
      heading.id = heading.textContent
        .toLowerCase()
        .replace(/[^\w]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = `#${heading.id}`;
    link.textContent = heading.textContent;
    link.classList.add('nav-link');
    
    // 添加平滑滚动
    link.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelector(link.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
    
    li.appendChild(link);
    nav.appendChild(li);
  });
}

// 更新语言切换器状态
function updateLanguageSwitcher(lang) {
  document.querySelectorAll('.language-switcher button').forEach(button => {
    button.classList.toggle('active', button.dataset.lang === lang);
  });
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  // 加载marked.js库
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
  document.head.appendChild(script);

  // 处理语言切换
  document.querySelectorAll('.language-switcher button').forEach(button => {
    button.addEventListener('click', () => {
      currentLang = button.dataset.lang;
      loadContent(currentLang);
    });
  });

  // 初始加载
  loadContent(currentLang);
});
