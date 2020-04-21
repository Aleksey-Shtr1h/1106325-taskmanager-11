import {renderTask} from './controllers/board.js';
import {remove} from './utils/render.js';

export const createPaginationTasks = (tasks, loadBtn, container, showingTasksCount) => {

  const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

  const prevTasksCount = showingTasksCount;
  showingTasksCount = showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

  tasks.slice(prevTasksCount, showingTasksCount)
  .forEach((task) => renderTask(container, task));

  if (showingTasksCount >= tasks.length) {
    remove(loadBtn);
    loadBtn.removeElement();
  }

};
