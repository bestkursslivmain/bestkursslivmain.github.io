// script.js
let courses = []; // все курсы из JSON
let filteredCourses = []; // после поиска
let currentPage = 1;
const coursesPerPage = 10;
let totalPages = 1;

// Добавляем класс, чтобы скрыть "мигание" (см. CSS в index.template.html)
document.documentElement.classList.add('js-enabled');

// Загрузка данных из JSON
async function loadCourses() {
  try {
    const response = await fetch('courses.json');
    if (!response.ok) throw new Error('Не удалось загрузить файл courses.json');
    courses = await response.json();
    filteredCourses = [...courses];
    render();
  } catch (error) {
    console.error('Ошибка загрузки:', error);
    document.getElementById('courses-container').innerHTML = '<p style="color:red;">Ошибка загрузки курсов.</p>';
  }
}

function render() {
  totalPages = Math.ceil(filteredCourses.length / coursesPerPage) || 1;
  currentPage = Math.min(currentPage, totalPages);
  if (currentPage < 1) currentPage = 1;

  displayPage(currentPage);
  updatePageInfo();
  updateButtons();
}

// Управление видимостью — НЕ пересоздаём DOM!
function displayPage(page) {
  const start = (page - 1) * coursesPerPage;
  const end = start + coursesPerPage;

  const courseItems = document.querySelectorAll('#courses-container .course-item');
  courseItems.forEach((item, idx) => {
    // Показываем, только если курс есть в filteredCourses И находится на текущей странице
    const courseTitle = item.getAttribute('data-title');
    const isVisible = filteredCourses.slice(start, end).some(c => c.title === courseTitle);
    item.style.display = isVisible ? '' : 'none';
  });
}

function updateButtons() {
  document.getElementById('prev-btn').disabled = currentPage <= 1;
  document.getElementById('next-btn').disabled = currentPage >= totalPages;
}

function updatePageInfo() {
  document.getElementById('page-info').textContent = `Страница ${currentPage} из ${totalPages}`;
}

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

// Обработчики
document.getElementById('prev-btn')?.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    render();
  }
});

document.getElementById('next-btn')?.addEventListener('click', () => {
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
  // Сначала скрываем всё, чтобы не было мигания
  const container = document.getElementById('courses-container');
  if (container) {
    const items = container.querySelectorAll('.course-item');
    items.forEach(item => item.style.display = 'none');
  }
  loadCourses();
});
