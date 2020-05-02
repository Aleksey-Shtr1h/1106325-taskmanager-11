import TaskController from './task.js';

import TasksComponent from '../components/create-site-blockTasks.js';
import SortComponent, {SortType} from '../components/create-site-filters-sort.js';
import NoTasksComponent from '../components/create-site-no-tasks.js';

import LoadMoreBtnComponent from '../components/create-site-loadBtn.js';

import {renderTemplate, RenderPosition} from '../utils/render.js';
import {createPaginationTasks} from '../pagination.js';

const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

export const renderTasks = (taskListElement, tasks, onDataChange, onViewChange) => {
  return tasks.map((task) => {
    const taskController = new TaskController(taskListElement, onDataChange, onViewChange);
    taskController.renderTask(task);
    return taskController;
  });
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

    this._tasks = [];
    this._showedTaskControllers = [];

    this._showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

    this._noTasksComponent = new NoTasksComponent();
    this._sortComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._loadMoreButtonComponent = new LoadMoreBtnComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange .bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render(tasks) {
    this._tasks = tasks;

    const container = this._container.getElement();
    const areAllTasksArchived = this._tasks.every((task) => task.isArchive);

    if (areAllTasksArchived) {
      renderTemplate(container, this._noTasksComponent, RenderPosition.BEFOREEND);
      return;
    }

    renderTemplate(container, this._sortComponent, RenderPosition.BEFOREEND);
    renderTemplate(container, this._tasksComponent, RenderPosition.BEFOREEND);

    const taskListElement = this._tasksComponent.getElement();

    const newTasks = renderTasks(taskListElement, tasks.slice(0, this._showingTasksCount), this._onDataChange, this._onViewChange);
    this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);

    this._renderLoadMoreBtn();
  }

  _renderLoadMoreBtn() {

    if (this._showingTasksCount >= this._tasks.length) {
      return;
    }

    const container = this._container.getElement();
    renderTemplate(container, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);

    this._loadMoreButtonComponent.setClickHandler(() => {
      const loadMoreBtnComponent = this._loadMoreButtonComponent;
      const taskListElement = this._tasksComponent.getElement();

      const prevTasksCount = this._showingTasksCount;
      this._showingTasksCount = this._showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

      const sortedTasks = getSortedTasks(this._tasks, this._sortComponent.getSortType(), prevTasksCount, this._showingTasksCount);

      const newTasks = createPaginationTasks(this._tasks, loadMoreBtnComponent, taskListElement, sortedTasks, this._showingTasksCount, this._onDataChange, this._onViewChange);
      this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);
    });
  }

  _onDataChange(taskController, oldData, newData) {
    const index = this._tasks.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._tasks = [].concat(this._tasks.slice(0, index), newData, this._tasks.slice(index + 1));

    taskController.renderTask(this._tasks[index]);
  }

  _onViewChange() {
    this._showedTaskControllers.forEach((it) => it.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    const taskListElement = this._tasksComponent.getElement();
    this._showingTasksCount = SHOWING_TASKS_COUNT_BY_BUTTON;

    const sortedTasks = getSortedTasks(this._tasks, sortType, 0, this._showingTasksCount);

    taskListElement.innerHTML = ``;

    const newTasks = renderTasks(taskListElement, sortedTasks, this._onDataChange, this._onViewChange);
    this._showedTaskControllers = newTasks;

    this._renderLoadMoreBtn();
  }
}
