import {createMenuTemplate} from './components/create-site-menu.js';
import {createFilterTemplate} from './components/create-site-filters.js';
import {createBoardTemplate} from './components/create-site-basic-container.js';
import {createSortTemplate} from './components/create-site-filters-sort.js';
import {createEditTaskTemplate} from './components/create-site-editTask.js';
import {createCardTaskTemplate} from './components/create-site-cardTask.js';
import {createLoadBtnTemplate} from './components/create-site-loadBtn.js';

import {generateFilters} from './mock/filter.js';
import {generateTasks} from './mock/task.js';
import {createPaginationTasks} from './pagination.js';

const TASK_COUNT = 22;
const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

const siteMainElement = document.querySelector(`.main`);
const siteMainControlElement = siteMainElement.querySelector(`.main__control`);

const renderTemplate = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const getBasicBlock = () => {
  const filters = generateFilters();
  renderTemplate(siteMainControlElement, createMenuTemplate());
  renderTemplate(siteMainElement, createFilterTemplate(filters));
  renderTemplate(siteMainElement, createBoardTemplate());
};

const getMainContentSite = () => {
  const tasks = generateTasks(TASK_COUNT);
  const siteBoardElement = siteMainElement.querySelector(`.board`);
  const siteBoardTaskElement = siteBoardElement.querySelector(`.board__tasks`);

  let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

  renderTemplate(siteBoardElement, createSortTemplate(), `afterbegin`);
  renderTemplate(siteBoardTaskElement, createEditTaskTemplate(tasks[0]));

  tasks.slice(1, showingTasksCount)
  .forEach((task) => renderTemplate(siteBoardTaskElement, createCardTaskTemplate(task)));


  renderTemplate(siteBoardElement, createLoadBtnTemplate());

  const loadMoreButton = siteBoardElement.querySelector(`.load-more`);
  loadMoreButton.addEventListener(`click`, () => {

    createPaginationTasks(tasks, loadMoreButton, renderTemplate, siteBoardTaskElement, createCardTaskTemplate);

  });

};

getBasicBlock();
getMainContentSite();

export {SHOWING_TASKS_COUNT_BY_BUTTON};
