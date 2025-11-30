let courses = []; // Все курсы из JSON
let filteredCourses = []; // Отфильтрованные курсы (для поиска)
let currentPage = 1;
const coursesPerPage = 10;
let totalPages = 0;

// Загрузка курсов
async function loadCourses() {
  try {
    const response = await fetch('courses.json');
    if (!response.ok) {
      throw new Error('Ошибка при загрузке данных');
    }
    courses = await response.json();
    filteredCourses = [...courses]; // Изначально показываем все
    totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
    updatePageInfo();
    displayPage(currentPage);
  } catch (error) {
    console.error('Ошибка:', error);
    document.getElementById('courses-container').innerHTML = '<p>Ошибка загрузки курсов.</p>';
  }
}

// Отображение текущей страницы из filteredCourses
function displayPage(page) {
  const startIndex = (page - 1) * coursesPerPage;
  const endIndex = startIndex + coursesPerPage;
  const coursesToShow = filteredCourses.slice(startIndex, endIndex);

  const container = document.getElementById('courses-container');
  container.innerHTML = '';

  if (coursesToShow.length === 0) {
    container.innerHTML = '<p>Курсов не найдено.</p>';
  } else {
    coursesToShow.forEach(course => {
      const courseElement = document.createElement('div');
      courseElement.className = 'course-item';
      courseElement.innerHTML = `<h3>${course.title}</h3>`;
      container.appendChild(courseElement);
    });
  }

  updateButtons();
}

// Обновление состояния кнопок
function updateButtons() {
  document.getElementById('prev-btn').disabled = currentPage === 1;
  document.getElementById('next-btn').disabled = currentPage === totalPages;
}

// Обновление индикатора страницы
function updatePageInfo() {
  document.getElementById('page-info').textContent = `Страница ${currentPage} из ${totalPages}`;
}

// Функция фильтрации курсов
function filterCourses(query) {
  const q = query.trim().toLowerCase();
  if (q === '') {
    filteredCourses = [...courses];
  } else {
    filteredCourses = courses.filter(course =>
      course.title.toLowerCase().includes(q)
      // Можно раскомментировать, если хотите искать и в описании:
      // || (course.description && course.description.toLowerCase().includes(q))
    );
  }

  // Сброс пагинации
  currentPage = 1;
  totalPages = Math.ceil(filteredCourses.length / coursesPerPage) || 1;
  updatePageInfo();
  displayPage(currentPage);
}

// Обработчики кнопок
document.getElementById('prev-btn').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    displayPage(currentPage);
    updatePageInfo();
  }
});

document.getElementById('next-btn').addEventListener('click', () => {
  if (currentPage < totalPages) {
    currentPage++;
    displayPage(currentPage);
    updatePageInfo();
  }
});

// Обработчик поиска
document.getElementById('search-input').addEventListener('input', (e) => {
  filterCourses(e.target.value);
});

// Загрузка при старте
loadCourses();
