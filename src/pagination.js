import {renderTask} from './main.js';

export const createPaginationTasks = (tasks, loadBtn, container, showingTasksCount) => {
  const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

  const prevTasksCount = showingTasksCount;
  showingTasksCount = showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

  tasks.slice(prevTasksCount, showingTasksCount)
  .forEach((task) => renderTask(container, task));

  if (showingTasksCount >= tasks.length) {
    loadBtn.getElement().remove();
    loadBtn.removeElement();
  }

};
