import {createElement} from '../utils.js';

const createTasksTemplate = () => {
  return (
    `<section class="board container">
      <div class="board__tasks">
      </div>
    </section>`
  );
};

export default class Tasks {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createTasksTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

