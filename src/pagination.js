import {renderTasks} from './controllers/board.js';
import {remove} from './utils/render.js';

export const createPaginationTasks = (tasks, loadBtn, container, showingTasksCount, onDataChange, onViewChange) => {

  const newTasks = renderTasks(container, tasks, onDataChange, onViewChange);

  if (showingTasksCount >= tasks.length) {
    remove(loadBtn);
  }

  return newTasks;

};
