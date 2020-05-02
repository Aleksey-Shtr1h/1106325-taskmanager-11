import {renderTasks} from './controllers/board.js';
import {remove} from './utils/render.js';

export const createPaginationTasks = (tasks, loadBtn, container, sortedTasks, showingTasksCount) => {

  const newTasks = renderTasks(container, sortedTasks);

  if (showingTasksCount >= tasks.length) {
    remove(loadBtn);
  }

  return newTasks;

};
