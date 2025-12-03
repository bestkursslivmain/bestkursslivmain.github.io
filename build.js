// build.js
const fs = require('fs').promises;

async function build() {
  try {
    const courses = JSON.parse(await fs.readFile('courses.json', 'utf8'));
    let html = await fs.readFile('index.template.html', 'utf8');

    // Генерируем HTML для ВСЕХ курсов — без скрытия!
    const coursesHtml = courses.map(course => `
      <div class="course-item" data-title="${escapeHtmlAttr(course.title || '')}">
        <h3>${escapeHtml(course.title || 'Без названия')}</h3>
      </div>
    `.trim()).join('');

    html = html.replace('<!-- COURSES_PLACEHOLDER -->', coursesHtml);
    await fs.writeFile('index.html', html, 'utf8');

    console.log('✅ Успех! Все курсы добавлены в index.html для SEO.');
  } catch (err) {
    console.error('❌ Ошибка:', err.message);
    process.exit(1);
  }
}

function escapeHtml(text) {
  if (typeof text !== 'string') return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeHtmlAttr(text) {
  if (typeof text !== 'string') return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/ /g, ' '); // можно оставить пробелы
}

build();
