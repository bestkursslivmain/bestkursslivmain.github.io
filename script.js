let courses = []; // Все курсы
let filteredCourses = []; // Отфильтрованные курсы
let currentPage = 1;
const coursesPerPage = 10;
let totalPages = 1;

// Загрузка данных из courses.json
async function loadCourses() {
  try {
    const response = await fetch('courses.json');
    if (!response.ok) throw new Error('Не удалось загрузить файл courses.json');
    courses = await response.json();
    filteredCourses = [...courses];
    render();
  } catch (error) {
    console.error('Ошибка загрузки:', error);
    document.getElementById('courses-container').innerHTML = '<p style="color:red;">Ошибка загрузки курсов. Проверьте файл courses.json.</p>';
  }
}

// Основная функция отображения
function render() {
  totalPages = Math.ceil(filteredCourses.length / coursesPerPage) || 1;
  currentPage = Math.min(currentPage, totalPages); // На случай, если после поиска страниц стало меньше
  if (currentPage < 1) currentPage = 1;

  displayPage(currentPage);
  updatePageInfo();
  updateButtons();
}

// Отображение одной страницы
function displayPage(page) {
  const start = (page - 1) * coursesPerPage;
  const end = start + coursesPerPage;
  const pageCourses = filteredCourses.slice(start, end);

  const container = document.getElementById('courses-container');
  if (pageCourses.length === 0) {
    container.innerHTML = '<p>Курсов не найдено.</p>';
    return;
  }

  container.innerHTML = pageCourses
    .map(course => `
      <div class="course-item">
        <h3>${escapeHtml(course.title || 'Без названия')}</h3>
      </div>
    `)
    .join('');
}

// Обновление кнопок
function updateButtons() {
  document.getElementById('prev-btn').disabled = currentPage <= 1;
  document.getElementById('next-btn').disabled = currentPage >= totalPages;
}

// Обновление текста страницы
function updatePageInfo() {
  document.getElementById('page-info').textContent = `Страница ${currentPage} из ${totalPages}`;
}

// Фильтрация курсов
function filterCourses(query) {
  const q = query.trim().toLowerCase();
  if (q === '') {
    filteredCourses = [...courses];
  } else {
    filteredCourses = courses.filter(course =>
      course.title &&
      typeof course.title === 'string' &&
      course.title.toLowerCase().includes(q)
    );
  }
  currentPage = 1;
  render();
}

// Защита от XSS (опционально, но полезно)
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Обработчики событий
document.getElementById('prev-btn').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    render();
  }
});

document.getElementById('next-btn').addEventListener('click', () => {
  if (currentPage < totalPages) {
    currentPage++;
    render();
  }
});

// Поиск при вводе текста
document.getElementById('search-input').addEventListener('input', (e) => {
  filterCourses(e.target.value);
});

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', loadCourses);
