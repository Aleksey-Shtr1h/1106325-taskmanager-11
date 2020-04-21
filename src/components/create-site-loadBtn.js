import AbstractComponent from './abstract-component.js';

const createLoadBtnTemplate = () => {
  return (
    `<button class="load-more" type="button">load more</button>`
  );
};

export default class LoadBtnTemplate extends AbstractComponent {

  getTemplate() {
    return createLoadBtnTemplate();
  }

  setClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }
}
