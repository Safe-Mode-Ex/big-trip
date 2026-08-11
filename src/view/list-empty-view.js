import AbstractView from '../framework/view/abstract-view';
import { FilterType } from '../const';

const ListEmptyTextType = {
  [FilterType.ALL]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.FUTURE]: 'There are no future events now',
};

function createListEmptyTemplate(filterType) {
  const listEmptyTextValue = ListEmptyTextType[filterType];
  return `<p class="trip-events__msg">${listEmptyTextValue}</p>`;
}

export default class ListEmptyView extends AbstractView {
  #filterType = null;

  constructor({filterType}) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createListEmptyTemplate(this.#filterType);
  }
}
