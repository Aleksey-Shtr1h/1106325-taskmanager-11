import TasksComponent from '../components/create-site-blockTasks.js';
import SortComponent, {SortType} from '../components/create-site-filters-sort.js';
import NoTasksComponent from '../components/create-site-no-tasks.js';
import EditTaskComponent from '../components/create-site-editTask.js';
import CardTaskComponent from '../components/create-site-cardTask.js';
import LoadMoreBtnComponent from '../components/create-site-loadBtn.js';

import {renderTemplate, replaceTemplate, RenderPosition} from '../utils/render.js';
import {createPaginationTasks} from '../pagination.js';

const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

const StatusCodesEsc = {
  ESCAPE: `Escape`,
  ESC: `Esc`,
};

const renderTask = (taskListElement, task) => {

  const replaceTaskToEdit = () => {
    replaceTemplate(taskEditComponent, taskComponent);
  };

  const replaceEditToTask = () => {
    replaceTemplate(taskComponent, taskEditComponent);
  };

  const onEscKeyDown = (evt) => {
    const isEscKay = evt.key === StatusCodesEsc.ESCAPE || StatusCodesEsc.ESC;
    if (isEscKay) {
      replaceEditToTask();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const taskComponent = new CardTaskComponent(task);

  taskComponent.setEditButtonClickHandler(() => {
    replaceTaskToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  const taskEditComponent = new EditTaskComponent(task);

  taskEditComponent.setSubmitHandler((evt) => {
    evt.preventDefault();
    replaceEditToTask();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  renderTemplate(taskListElement, taskComponent, RenderPosition.BEFOREEND);
};

export const renderTasks = (taskListElement, tasks) => {
  tasks.forEach((task) => renderTask(taskListElement, task));
};

const getSortedTasks = (tasks, sortType, from, to) => {
  let sortedTasks = [];
  const showingTasks = tasks.slice();

  switch (sortType) {
    case SortType.DATE_UP:
      sortedTasks = showingTasks.sort((a, b) => a.dueDate - b.dueDate);
      break;
    case SortType.DATE_DOWN:
      sortedTasks = showingTasks.sort((a, b) => b.dueDate - a.dueDate);
      break;
    case SortType.DEFAULT:
      sortedTasks = showingTasks;
      break;
  }

  return sortedTasks.slice(from, to);
};

export default class BoardController {

  constructor(container) {
    this._container = container;
    this._noTasksComponent = new NoTasksComponent();
    this._sortComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._loadMoreButtonComponent = new LoadMoreBtnComponent();
  }

  render(tasks) {

    const renderLoadMoreBtn = () => {

      if (showingTasksCount >= tasks.length) {
        return;
      }

      renderTemplate(container, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);


      this._loadMoreButtonComponent.setClickHandler(() => {
        const loadMoreBtnComponent = this._loadMoreButtonComponent;

        const prevTasksCount = showingTasksCount;
        showingTasksCount = showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

        const sortedTasks = getSortedTasks(tasks, this._sortComponent.getSortType(), prevTasksCount, showingTasksCount);

        createPaginationTasks(tasks, loadMoreBtnComponent, taskListElement, sortedTasks, showingTasksCount);
      });
    };

    const container = this._container.getElement();
    const areAllTasksArchived = tasks.every((task) => task.isArchive);

    if (areAllTasksArchived) {
      renderTemplate(container, this._noTasksComponent, RenderPosition.BEFOREEND);
      return;
    }

    renderTemplate(container, this._sortComponent, RenderPosition.BEFOREEND);
    renderTemplate(container, this._tasksComponent, RenderPosition.BEFOREEND);

    const taskListElement = this._tasksComponent.getElement();

    let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

    renderTasks(taskListElement, tasks.slice(0, showingTasksCount));
    renderLoadMoreBtn();

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      showingTasksCount = SHOWING_TASKS_COUNT_BY_BUTTON;

      const sortedTasks = getSortedTasks(tasks, sortType, 0, showingTasksCount);
      taskListElement.innerHTML = ``;

      renderTasks(taskListElement, sortedTasks);
      renderLoadMoreBtn();
    });
  }
}
