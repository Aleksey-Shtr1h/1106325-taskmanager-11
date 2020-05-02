import EditTaskComponent from '../components/create-site-editTask.js';
import CardTaskComponent from '../components/create-site-cardTask.js';

import {renderTemplate, replaceTemplate, RenderPosition} from '../utils/render.js';

const Modes = {
  DEFAULT: `default`,
  EDIT: `edit`,
};

const EscapeKey = {
  ESCAPE: `Escape`,
  ESC: `Esc`,
};

export default class TaskController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;

    this._onViewChange = onViewChange;
    this._mode = Modes.DEFAULT;

    this._taskComponent = null;
    this._taskEditComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  renderTask(task) {
    const oldTaskComponent = this._taskComponent;
    const oldTaskEditComponent = this._taskEditComponent;

    this._taskComponent = new CardTaskComponent(task);
    this._taskEditComponent = new EditTaskComponent(task);

    this._taskComponent.setEditButtonClickHandler(() => {
      this._replaceTaskToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._taskComponent.setArchiveButtonClickHandler(() => {
      this._onDataChange(this, task, Object.assign({}, task, {
        isArchive: !task.isArchive,
      }));
    });

    this._taskComponent.setFavoritesButtonClickHandler(() => {
      this._onDataChange(this, task, Object.assign({}, task, {
        isFavorite: !task.isFavorite,
      }));
    });

    this._taskEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      this._replaceEditToTask();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    if (oldTaskEditComponent && oldTaskComponent) {
      replaceTemplate(this._taskComponent, oldTaskComponent);
      replaceTemplate(this._taskEditComponent, oldTaskEditComponent);
    } else {
      renderTemplate(this._container, this._taskComponent, RenderPosition.BEFOREEND);
    }
  }

  setDefaultView() {
    if (this._mode !== Modes.DEFAULT) {
      this._replaceEditToTask();
    }
  }

  _replaceTaskToEdit() {
    this._onViewChange();
    replaceTemplate(this._taskEditComponent, this._taskComponent);
    this._mode = Modes.EDIT;
  }

  _replaceEditToTask() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._taskEditComponent.reset();
    replaceTemplate(this._taskComponent, this._taskEditComponent);
    this._mode = Modes.DEFAULT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === EscapeKey.ESCAPE;
    if (isEscKey) {
      this._replaceEditToTask();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
