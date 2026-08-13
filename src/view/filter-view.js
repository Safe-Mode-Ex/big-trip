import AbstractView from '../framework/view/abstract-view';

function createFilterTemplate(filters, currentFilterType) {
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
            ${type === currentFilterType ? 'checked' : ''}
            ${!count ? 'disabled' : ''}

          >
          <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
        </div>
      `)).join('')}

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `;
}

export default class FilterView extends AbstractView {
  #filters = null;
  #currentFilter = null;

  #handleFilterTypeChange = null;

  constructor({filters, currentFilterType, onFilterTypeChange}) {
    super();

    this.#filters = filters;
    this.#currentFilter = currentFilterType;
    this.#handleFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilter);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleFilterTypeChange(evt.target.value);
  };
}
