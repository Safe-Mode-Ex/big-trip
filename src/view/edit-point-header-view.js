import he from 'he';
import AbstractView from '../framework/view/abstract-view';
import { TYPES } from '../const';
import Store from '../store/store';

function createEventTypeList(id) {
  return `
    <div class="event__type-list">
      <fieldset class="event__type-group">
        <legend class="visually-hidden">Event type</legend>

        ${TYPES.map((type) => {
    const eventType = type.toLowerCase();
    return `<div class="event__type-item">
              <input
                id="event-type-${eventType}-${id}"
                class="event__type-input visually-hidden"
                type="radio"
                name="event-type"
                value="${type}"
              >
              <label
                class="event__type-label event__type-label--${eventType}"
                for="event-type-${eventType}-${id}"
              >${type}</label>
            </div>`;
  }).join('')}
      </fieldset>
    </div>
  `;
}

function createEditPointHeaderTemplate({
  id,
  type,
  destination,
  basePrice,
  isSaving,
  isDeleting,
  isDisabled,
}) {
  const eventType = type.toLowerCase();
  const deleteButtonText = isDeleting ? 'Deleting' : 'Delete';

  return `
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
          <span class="visually-hidden">Choose event type</span>
          <img
            class="event__type-icon"
            width="17"
            height="17"
            src="img/icons/${eventType}.png"
            alt="Event type icon"
          >
        </label>
        <input
          class="event__type-toggle visually-hidden"
          id="event-type-toggle-${id}"
          type="checkbox"
          ${isDisabled ? 'disabled' : ''}
        >

        ${createEventTypeList(id)}
      </div>

      <div class="event__field-group event__field-group--destination">
        <label
          class="event__label event__type-output"
          for="event-destination-${id}"
        >${type}</label>
        <input
          class="event__input event__input--destination"
          id="event-destination-${id}"
          type="text"
          name="event-destination"
          value="${destination ? he.encode(destination.name) : ''}"
          list="destination-list-${id}"
          required
          ${isDisabled ? 'disabled' : ''}
        >
        <datalist id="destination-list-${id}">
          ${Store.destinations.map(({name}) => `<option value="${name}"></option>`)}
        </datalist>
      </div>

      <div class="event__field-group event__field-group--time">
        <label class="visually-hidden" for="event-start-time-${id}">From</label>
        <input
          class="event__input event__input--time"
          id="event-start-time-${id}"
          type="text"
          name="event-start-time"
          required
          ${isDisabled ? 'disabled' : ''}
        >
        &mdash;
        <label class="visually-hidden" for="event-end-time-${id}">To</label>
        <input
          class="event__input event__input--time"
          id="event-end-time-${id}"
          type="text"
          name="event-end-time"
          required
          ${isDisabled ? 'disabled' : ''}
        >
      </div>

      <div class="event__field-group event__field-group--price">
        <label class="event__label" for="event-price-${id}">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input
          class="event__input event__input--price"
          id="event-price-${id}"
          type="text"
          name="event-price"
          value="${basePrice}"
          required
          ${isDisabled ? 'disabled' : ''}
        >
      </div>

      <button
        class="event__save-btn btn btn--blue"
        type="submit"
        ${isDisabled ? 'disabled' : ''}
      >
        ${isSaving ? 'Saving' : 'Save'}
      </button>
      <button
        class="event__reset-btn"
        type="reset"
        ${isDisabled ? 'disabled' : ''}
      >
        ${id ? deleteButtonText : 'Reset'}
      </button>

      ${id ? (`
        <button
          class="event__rollup-btn"
          type="button"
          ${isDisabled ? 'disabled' : ''}
        >
          <span class="visually-hidden">Open event</span>
        </button>
      `) : ''}
    </header>
  `;
}

export default class EditPointHeaderView extends AbstractView {
  #point = null;

  constructor({point}) {
    super();
    this.#point = point;
  }

  get template() {
    return createEditPointHeaderTemplate(this.#point);
  }
}
