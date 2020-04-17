import BoardComponent from './components/create-site-basic-container.js';
import SiteMenuComponent from './components/create-site-menu.js';
import FilterComponent from './components/create-site-filters.js';
import TasksComponent from './components/create-site-blockTasks.js';

import SortComponent from './components/create-site-filters-sort.js';
import EditTaskComponent from './components/create-site-editTask.js';
import CardTaskComponent from './components/create-site-cardTask.js';
import LoadMoreBtnComponent from './components/create-site-loadBtn.js';

import {generateFilters} from './mock/filter.js';
import {generateTasks} from './mock/task.js';
import {renderTemplate, RenderPosition} from './utils.js';
import {createPaginationTasks} from './pagination.js';

const TASK_COUNT = 22;
const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

export const renderTask = (taskListElement, task) => {
  const onEditButtonClick = () => {
    taskListElement.replaceChild(taskEditComponent.getElement(), taskComponent.getElement());
  };

  const onEditFormSubmit = (evt) => {
    evt.preventDefault();
    taskListElement.replaceChild(taskComponent.getElement(), taskEditComponent.getElement());
  };

  const taskComponent = new CardTaskComponent(task);
  const editButton = taskComponent.getElement().querySelector(`.card__btn--edit`);
  editButton.addEventListener(`click`, onEditButtonClick);

  const taskEditComponent = new EditTaskComponent(task);
  const editForm = taskEditComponent.getElement().querySelector(`form`);
  editForm.addEventListener(`submit`, onEditFormSubmit);

  renderTemplate(taskListElement, taskComponent.getElement(), RenderPosition.BEFOREEND);
};

const renderBoard = (boardComponent, tasks) => {
  renderTemplate(boardComponent.getElement(), new SortComponent().getElement(), RenderPosition.BEFOREEND);
  renderTemplate(boardComponent.getElement(), new TasksComponent().getElement(), RenderPosition.BEFOREEND);

  const taskListElement = boardComponent.getElement().querySelector(`.board__tasks`);

  let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;
  tasks.slice(0, showingTasksCount)
    .forEach((task) => {
      renderTask(taskListElement, task);
    });

  const loadMoreButtonComponent = new LoadMoreBtnComponent();
  const loadMoreButtonElement = loadMoreButtonComponent.getElement();

  renderTemplate(boardComponent.getElement(), loadMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);


  loadMoreButtonElement.addEventListener(`click`, () => {
    createPaginationTasks(tasks, loadMoreButtonComponent, taskListElement, showingTasksCount);
    showingTasksCount = showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;
  });
};

const siteMainElement = document.querySelector(`.main`);
const siteMainControlElement = siteMainElement.querySelector(`.main__control`);

const tasks = generateTasks(TASK_COUNT);
const filters = generateFilters();

renderTemplate(siteMainControlElement, new SiteMenuComponent().getElement(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, new FilterComponent(filters).getElement(), RenderPosition.BEFOREEND);

const boardComponent = new BoardComponent();
renderTemplate(siteMainElement, boardComponent.getElement(), RenderPosition.BEFOREEND);
renderBoard(boardComponent, tasks);
