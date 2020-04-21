import BoardController from './controllers/board.js';
import BoardComponent from './components/create-site-basic-container.js';
import SiteMenuComponent from './components/create-site-menu.js';
import FilterComponent from './components/create-site-filters.js';

import {generateFilters} from './mock/filter.js';
import {generateTasks} from './mock/task.js';
import {renderTemplate, RenderPosition} from './utils/render.js';

const TASK_COUNT = 22;

const siteMainElement = document.querySelector(`.main`);
const siteMainControlElement = siteMainElement.querySelector(`.main__control`);

const tasks = generateTasks(TASK_COUNT);
const filters = generateFilters();

renderTemplate(siteMainControlElement, new SiteMenuComponent(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, new FilterComponent(filters), RenderPosition.BEFOREEND);

const boardComponent = new BoardComponent();
const boardController = new BoardController(boardComponent);
renderTemplate(siteMainElement, boardComponent, RenderPosition.BEFOREEND);
boardController.render(tasks);
