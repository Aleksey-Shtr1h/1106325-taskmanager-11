import TaskController, {Modes as TaskControllerModes, EmptyTask} from './task.js';

import TasksComponent from '../components/create-site-blockTasks.js';
import SortComponent, {SortType} from '../components/create-site-filters-sort.js';
import NoTasksComponent from '../components/create-site-no-tasks.js';

import LoadMoreBtnComponent from '../components/create-site-loadBtn.js';

import {renderTemplate, RenderPosition, remove} from '../utils/render.js';
import {createPaginationTasks} from '../pagination.js';

const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

export const renderTasks = (taskListElement, tasks, onDataChange, onViewChange) => {
  return tasks.map((task) => {
    const taskController = new TaskController(taskListElement, onDataChange, onViewChange);
    taskController.renderTask(task, TaskControllerModes.DEFAULT);
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

  constructor(container, tasksModel) {
    this._container = container;
    this._tasksModel = tasksModel;

    // this._tasks = [];
    this._showedTaskControllers = [];

    this._showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

    this._noTasksComponent = new NoTasksComponent();
    this._sortComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._loadMoreButtonComponent = new LoadMoreBtnComponent();
    this._creatingTask = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange .bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onLoadMoreBtnClick = this._onLoadMoreBtnClick.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._tasksModel.setFilterChangeHandler(this._onFilterChange);
  }

  render() {
    const tasks = this._tasksModel.getTasks();

    const container = this._container.getElement();
    const areAllTasksArchived = tasks.every((task) => task.isArchive);

    if (areAllTasksArchived) {
      renderTemplate(container, this._noTasksComponent, RenderPosition.BEFOREEND);
      return;
    }

    renderTemplate(container, this._sortComponent, RenderPosition.BEFOREEND);
    renderTemplate(container, this._tasksComponent, RenderPosition.BEFOREEND);

    this._renderTasks(tasks.slice(0, this._showingTasksCount));
    this._renderLoadMoreBtn();
  }

  createTask() {
    if (this._creatingTask) {
      return;
    }

    const taskListElement = this._tasksComponent.getElement();
    this._creatingTask = new TaskController(taskListElement, this._onDataChange, this._onViewChange);
    this._creatingTask.renderTask(EmptyTask, TaskControllerModes.ADDING);
  }

  _removeTasks() {
    this._showedTaskControllers.forEach((taskController) => taskController.destroy());
    this._showedTaskControllers = [];
  }

  _renderTasks(tasks) {
    const loadMoreBtnComponent = this._loadMoreButtonComponent;
    const taskListElement = this._tasksComponent.getElement();

    const newTasks = createPaginationTasks(tasks, loadMoreBtnComponent, taskListElement, this._showingTasksCount, this._onDataChange, this._onViewChange);

    this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);
    this._showingTasksCount = this._showedTaskControllers.length;
  }

  _renderLoadMoreBtn() {
    remove(this._loadMoreButtonComponent);

    if (this._showingTasksCount >= this._tasksModel.length) {
      return;
    }

    const container = this._container.getElement();
    renderTemplate(container, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);

    this._loadMoreButtonComponent.setClickHandler(this._onLoadMoreBtnClick);
  }

  _updateTasks(count) {
    this._removeTasks();
    this._renderTasks(this._tasksModel.getTasks().slice(0, count));
    this._renderLoadMoreBtn();
  }

  _onDataChange(taskController, oldData, newData) {
    if (oldData === EmptyTask) {
      this._creatingTask = null;
      if (newData === null) {
        taskController.destroy();
        this._updateTasks(this._showingTasksCount);
      } else {
        this._tasksModel.addTask(newData);
        taskController.renderTask(newData, TaskControllerModes.DEFAULT);

        if (this._showingTasksCount % SHOWING_TASKS_COUNT_BY_BUTTON === 0) {
          const destroyedTask = this._showedTaskControllers.pop();
          destroyedTask.destroy();
        }

        this._showedTaskControllers = [].concat(taskController, this._showedTaskControllers);
        this._showingTasksCount = this._showedTaskControllers.length;

        this._renderLoadMoreBtn();
      }
    } else if (newData === null) {
      this._tasksModel.removeTask(oldData.id);
      this._updateTasks(this._showingTasksCount);
    } else {
      const isSuccess = this._tasksModel.updateTask(oldData.id, newData);

      if (isSuccess) {
        taskController.renderTask(newData, TaskControllerModes.DEFAULT);
      }
    }
  }

  _onViewChange() {
    this._showedTaskControllers.forEach((it) => it.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    const tasks = this._tasksModel.getTasks();

    // const taskListElement = this._tasksComponent.getElement();
    this._showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

    const sortedTasks = getSortedTasks(tasks, sortType, 0, this._showingTasksCount);

    this._removeTasks();
    this._renderTasks(sortedTasks);

    this._renderLoadMoreBtn();
  }

  _onLoadMoreBtnClick() {
    const prevTasksCount = this._showingTasksCount;
    const tasks = this._tasksModel.getTasks();

    this._showingTasksCount = this._showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

    const sortedTasks = getSortedTasks(tasks, this._sortComponent.getSortType(), prevTasksCount, this._showingTasksCount);
    this._renderTasks(sortedTasks);
  }

  _onFilterChange() {
    this._updateTasks(SHOWING_TASKS_COUNT_ON_START);
  }
}
