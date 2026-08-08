import dayjs from 'dayjs';
import AbstractView from '../framework/view/abstract-view';
import { TYPES, EVENT_DATE_FORMAT } from '../const';
import { mockDestinations } from '../mock/destination';

function createEventTypeList() {
  return `
    <div class="event__type-list">
      <fieldset class="event__type-group">
        <legend class="visually-hidden">Event type</legend>

        ${TYPES.map((type) => {
    const eventType = type.toLowerCase();
    return `<div class="event__type-item">
              <input
                id="event-type-${eventType}-1"
                class="event__type-input visually-hidden"
                type="radio"
                name="event-type"
                value="${type}"
              >
              <label
                class="event__type-label event__type-label--${eventType}"
                for="event-type-${eventType}-1"
              >${type}</label>
            </div>`;
  }).join('')}
      </fieldset>
    </div>
  `;
}

function createEditPointHeaderTemplate({type, destination, dateFrom, dateTo, basePrice}) {
  const eventType = type.toLowerCase();
  const eventDateFrom = dayjs(dateFrom).format(EVENT_DATE_FORMAT);
  const eventDateTo = dayjs(dateTo).format(EVENT_DATE_FORMAT);

  return `
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img
            class="event__type-icon"
            width="17"
            height="17"
            src="img/icons/${eventType}.png"
            alt="Event type icon"
          >
        </label>
        <input class="event__type-toggle visually-hidden" id="event-type-toggle-1" type="checkbox">

        ${createEventTypeList()}
      </div>

      <div class="event__field-group event__field-group--destination">
        <label class="event__label event__type-output" for="event-destination-1">${type}</label>
        <input
          class="event__input event__input--destination"
          id="event-destination-1"
          type="text"
          name="event-destination"
          value="${destination.name}"
          list="destination-list-1"
        >
        <datalist id="destination-list-1">
          ${mockDestinations.map(({name}) => `<option value="${name}"></option>`)}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input
          class="event__input event__input--time"
          id="event-start-time-1"
          type="text"
          name="event-start-time"
          value="${eventDateFrom}"
        >
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input
          class="event__input event__input--time"
          id="event-end-time-1"
          type="text"
          name="event-end-time"
          value="${eventDateTo}"
        >
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input
          class="event__input event__input--price"
          id="event-price-1"
          type="text"
          name="event-price"
          value="${basePrice}"
        >
      </div>

      <button class="event__save-btn btn btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Cancel</button>

      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
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
