import EditTaskComponent from '../components/create-site-editTask.js';
import CardTaskComponent from '../components/create-site-cardTask.js';

import {renderTemplate, replaceTemplate, RenderPosition, remove} from '../utils/render.js';

import {COLOR} from "../constants.js";

export const Modes = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

export const EmptyTask = {
  description: ``,
  dueDate: null,
  repeatingDays: {
    "mo": false,
    "tu": false,
    "we": false,
    "th": false,
    "fr": false,
    "sa": false,
    "su": false,
  },
  color: COLOR.BLACK,
  isFavorite: false,
  isArchive: false,
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

  renderTask(task, modes) {
    const oldTaskComponent = this._taskComponent;
    const oldTaskEditComponent = this._taskEditComponent;
    this._mode = modes;

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
      // this._replaceEditToTask();
      const data = this._taskEditComponent.getData();
      this._onDataChange(this, task, data);
      // document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    this._taskEditComponent.setDeleteButtonClickHandler(() => this._onDataChange(this, task, null));

    switch (modes) {
      case Modes.DEFAULT:
        if (oldTaskEditComponent && oldTaskComponent) {
          replaceTemplate(this._taskComponent, oldTaskComponent);
          replaceTemplate(this._taskEditComponent, oldTaskEditComponent);
          this._replaceEditToTask();
        } else {
          renderTemplate(this._container, this._taskComponent, RenderPosition.BEFOREEND);
        }
        break;
      case Modes.ADDING:
        if (oldTaskEditComponent && oldTaskComponent) {
          remove(oldTaskComponent);
          remove(oldTaskEditComponent);
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);
        renderTemplate(this._container, this._taskEditComponent, RenderPosition.AFTERBEGIN);
        break;
    }
  }

  setDefaultView() {
    if (this._mode !== Modes.DEFAULT) {
      this._replaceEditToTask();
    }
  }

  destroy() {
    remove(this._taskEditComponent);
    remove(this._taskComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _replaceTaskToEdit() {
    this._onViewChange();
    replaceTemplate(this._taskEditComponent, this._taskComponent);
    this._mode = Modes.EDIT;
  }

  _replaceEditToTask() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._taskEditComponent.reset();
    // replaceTemplate(this._taskComponent, this._taskEditComponent);
    if (document.contains(this._taskEditComponent.getElement())) {
      replaceTemplate(this._taskComponent, this._taskEditComponent);
    }
    this._mode = Modes.DEFAULT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === EscapeKey.ESCAPE;
    if (isEscKey) {
      if (this._mode === Modes.ADDING) {
        this._onDataChange(this, EmptyTask, null);
      }
      this._replaceEditToTask();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
