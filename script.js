let courses = []; // Массив для хранения данных
let currentPage = 1;
const coursesPerPage = 10; // Количество курсов на одной "странице"
let totalPages = 0;

// Функция для загрузки данных
async function loadCourses() {
  try {
    const response = await fetch('courses.json'); // Загрузка JSON
    if (!response.ok) {
      throw new Error('Ошибка при загрузке данных');
    }
    courses = await response.json();
    totalPages = Math.ceil(courses.length / coursesPerPage); // Расчет общего числа страниц
    updatePageInfo(); // Обновить индикатор страницы
    displayPage(currentPage);
  } catch (error) {
    console.error('Ошибка:', error);
    document.getElementById('courses-container').innerHTML = '<p>Ошибка загрузки курсов.</p>';
  }
}

// Функция для отображения курсов на текущей странице
function displayPage(page) {
  const startIndex = (page - 1) * coursesPerPage;
  const endIndex = startIndex + coursesPerPage;
  const coursesToShow = courses.slice(startIndex, endIndex);

  const container = document.getElementById('courses-container');
  container.innerHTML = ''; // Очистить контейнер

  coursesToShow.forEach(course => {
    const courseElement = document.createElement('div');
    courseElement.className = 'course-item'; // Добавить класс для стилизации
    courseElement.innerHTML = `
      <h3>${course.title}</h3>
       
    `;
    container.appendChild(courseElement);
    //<p>${course.description}</p>
  });

  updateButtons(); // Обновить состояние кнопок
}

// Функция для обновления состояния кнопок
function updateButtons() {
  document.getElementById('prev-btn').disabled = currentPage === 1;
  document.getElementById('next-btn').disabled = currentPage === totalPages;
}

// Функция для обновления индикатора страницы
function updatePageInfo() {
  document.getElementById('page-info').textContent = `Страница ${currentPage} из ${totalPages}`;
}

// Обработчики событий для кнопок
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

// Загрузить данные при загрузке страницы
loadCourses();
