// script.js — работает ТОЛЬКО с DOM, без courses.json!
// document.documentElement.classList.add('js-enabled');

const coursesPerPage = 10;
let currentPage = 1;
let allCourseItems = [];
let filteredItems = [];

// Извлекаем курсы из DOM при старте
function initCourses() {
  const container = document.getElementById('courses-container');
  allCourseItems = Array.from(container.querySelectorAll('.course-item'));
  filteredItems = [...allCourseItems];
  currentPage = 1;
  render();
}

function render() {
  const totalPages = Math.ceil(filteredItems.length / coursesPerPage) || 1;
  currentPage = Math.min(currentPage, totalPages);
  currentPage = Math.max(currentPage, 1);

  // Скрываем всё
  allCourseItems.forEach(item => item.style.display = 'none');

  // Показываем текущую страницу
  const start = (currentPage - 1) * coursesPerPage;
  const pageItems = filteredItems.slice(start, start + coursesPerPage);
  pageItems.forEach(item => item.style.display = '');

  // Обновляем UI
  document.getElementById('page-info').textContent = `Страница ${currentPage} из ${totalPages}`;
  document.getElementById('prev-btn').disabled = currentPage <= 1;
  document.getElementById('next-btn').disabled = currentPage >= totalPages;
}

function normalizeText(str) {
  if (typeof str !== 'string') return '';
  return str
    .toLowerCase()                     // 1. Приводим к нижнему регистру
    .normalize('NFD')                  // 2. Разделяем буквы и диакритику (ё → e, ñ → n и т.д.)
    .replace(/[\u0300-\u036f]/g, '')  // 3. Убираем диакритические знаки
    .replace(/[^a-zа-я0-9\s]/g, ' ')  // 4. Убираем ВСЕ знаки препинания (оставляем только буквы, цифры, пробелы)
    .replace(/\s+/g, ' ')              // 5. Заменяем множественные пробелы на один
    .trim();                           // 6. Убираем пробелы по краям
}

function filterCourses(query) {
  const q = normalizeText(query);
  
  if (q === '') {
    filteredItems = [...allCourseItems];
  } else {
    filteredItems = allCourseItems.filter(item => {
      const titleEl = item.querySelector('h3');
      const title = titleEl ? titleEl.textContent : '';
      const normalizedTitle = normalizeText(title);
      
      // Ищем, есть ли запрос как подстрока в названии
      return normalizedTitle.includes(q);
    });
  }
  
  currentPage = 1;
  render();
}
// function filterCourses(query) {
//   const q = query.trim().toLowerCase();
//   if (q === '') {
//     filteredItems = [...allCourseItems];
//   } else {
//     filteredItems = allCourseItems.filter(item => {
//       const title = item.querySelector('h3')?.textContent || '';
//       return title.toLowerCase().includes(q);
//     });
//   }
//   currentPage = 1;
//   render();
// }

// Обработчики
document.getElementById('prev-btn')?.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    render();
  }
});

document.getElementById('next-btn')?.addEventListener('click', () => {
  const totalPages = Math.ceil(filteredItems.length / coursesPerPage) || 1;
  if (currentPage < totalPages) {
    currentPage++;
    render();
  }
});

document.getElementById('search-input')?.addEventListener('input', (e) => {
  filterCourses(e.target.value);
});

// Запуск
document.addEventListener('DOMContentLoaded', () => {
  // Сразу скрываем всё, чтобы не было мигания
  const container = document.getElementById('courses-container');
  if (container) {
    const items = container.querySelectorAll('.course-item');
    items.forEach(item => item.style.display = 'none');
  }
  // Инициализируем из DOM
  initCourses();
});
