import {createElement} from '../utils.js';

const createLoadBtnTemplate = () => {
  return (
    `<button class="load-more" type="button">load more</button>`
  );
};

export default class LoadBtnTemplate {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createLoadBtnTemplate();
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
