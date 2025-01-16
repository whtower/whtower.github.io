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
  const nav = document.querySelector('.main-nav');
  const headings = document.querySelectorAll('#content h2, #content h3');
  
  nav.innerHTML = '';
  
  headings.forEach(heading => {
    const link = document.createElement('a');
    link.href = `#${heading.id}`;
    link.textContent = heading.textContent;
    link.classList.add(heading.tagName.toLowerCase());
    nav.appendChild(link);
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
