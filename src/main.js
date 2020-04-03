const TASK_COUNT = 3;
const siteMainElement = document.querySelector(`.main`);
const siteMainControlElement = siteMainElement.querySelector(`.main__control`);

import {createMenuTemplate} from './components/create-site-menu.js';
import {createFilterTemplate} from './components/create-site-filters.js';
import {createBoardTemplate} from './components/create-site-basic-container.js';
import {createSortTemplate} from './components/create-site-filters-sort.js';
import {createEditTaskTemplate} from './components/create-site-editTask.js';
import {createCardTaskTemplate} from './components/create-site-cardTask.js';
import {createLoadBtnTemplate} from './components/create-site-loadBtn.js';

const renderTemplate = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const getBasicBlock = () => {
  renderTemplate(siteMainControlElement, createMenuTemplate());
  renderTemplate(siteMainElement, createFilterTemplate());
  renderTemplate(siteMainElement, createBoardTemplate());
};

const getMainContentSite = () => {
  const siteBoardElement = siteMainElement.querySelector(`.board`);
  const siteBoardTaskElement = siteBoardElement.querySelector(`.board__tasks`);
  renderTemplate(siteBoardElement, createSortTemplate(), `afterbegin`);
  renderTemplate(siteBoardTaskElement, createEditTaskTemplate());

  for (let i = 0; i < TASK_COUNT; i++) {
    renderTemplate(siteBoardTaskElement, createCardTaskTemplate());
  }

  renderTemplate(siteBoardTaskElement, createLoadBtnTemplate());
};

getBasicBlock();
getMainContentSite();
