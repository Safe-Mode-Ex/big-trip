import AbstractView from '../framework/view/abstract-view';

function createLoadingTemplate(message) {
  return `<p class="trip-events__msg">${message}</p>`;
}

export default class LoadingView extends AbstractView {
  #message = '';

  constructor({message}) {
    super();
    this.#message = message;
  }

  get template() {
    return createLoadingTemplate(this.#message);
  }
}
