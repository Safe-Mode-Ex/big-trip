import { FilterType } from '../const';
import AbstractView from '../framework/view/abstract-view';

function createListFilterTemplate(filters) {
  return `
    <form class="trip-filters" action="#" method="get">
      ${filters.map(({type, count}) => (`
        <div class="trip-filters__filter">
          <input
            id="filter-${type}"
            class="trip-filters__filter-input visually-hidden"
            type="radio"
            name="trip-filter"
            value="${type}"
            ${type === FilterType.ALL ? 'checked' : ''}
            ${!count ? 'disabled' : ''}

          >
          <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
        </div>
      `)).join('')}

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `;
}

export default class ListFilterView extends AbstractView {
  #filters = null;

  constructor({filters}) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createListFilterTemplate(this.#filters);
  }
}
