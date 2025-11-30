// build.js
const fs = require('fs').promises;
const path = require('path');

async function build() {
  try {
    console.log('📖 Чтение courses.json...');
    const courses = JSON.parse(await fs.readFile('courses.json', 'utf8'));

    console.log('📄 Чтение шаблона index.template.html...');
    let html = await fs.readFile('index.template.html', 'utf8');

    // Генерируем HTML для курсов (все курсы, но можно ограничить первой страницей)
    const coursesHtml = courses.map(course => `
      <div class="course-item">
        <h3>${escapeHtml(course.title || 'Без названия')}</h3>
      </div>
    `.trim()).join('');

    html = html.replace('<!-- COURSES_PLACEHOLDER -->', coursesHtml);

    console.log('💾 Запись финального index.html...');
    await fs.writeFile('index.html', html, 'utf8');

    console.log('✅ Сборка завершена! index.html готов для публикации.');
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
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

build();
