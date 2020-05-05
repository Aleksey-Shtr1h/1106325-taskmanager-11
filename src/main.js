import TasksModel from './models/tasks-Model.js';

import BoardController from './controllers/board.js';
import FilterController from './controllers/filterController.js';

import BoardComponent from './components/create-site-basic-container.js';
import SiteMenuComponent, {MenuItem} from './components/create-site-menu.js';

import {generateTasks} from './mock/task.js';
import {renderTemplate, RenderPosition} from './utils/render.js';

const TASK_COUNT = 22;

const siteMainElement = document.querySelector(`.main`);
const siteMainControlElement = siteMainElement.querySelector(`.main__control`);

const tasks = generateTasks(TASK_COUNT);
const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);

const siteMenuComponent = new SiteMenuComponent();

renderTemplate(siteMainControlElement, siteMenuComponent, RenderPosition.BEFOREEND);
const filterController = new FilterController(siteMainElement, tasksModel);
filterController.renderFilter();
// renderTemplate(siteMainElement, new FilterComponent(filters), RenderPosition.BEFOREEND);

const boardComponent = new BoardComponent();
const boardController = new BoardController(boardComponent, tasksModel);
renderTemplate(siteMainElement, boardComponent, RenderPosition.BEFOREEND);
boardController.render();

siteMenuComponent.setOnChange((menuItem) => {
  switch (menuItem) {
    case MenuItem.NEW_TASK:
      siteMenuComponent.setActiveItem(MenuItem.TASKS);
      boardController.createTask();
      break;
  }
});
