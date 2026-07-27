import AbstractView from '../framework/view/abstract-view';
import { getDateTime, getDurationString, humanizePointDateFrom, humanizePointTime } from '../utils/point';

function createSelectedOffersTemplate(offers) {
  return `
    <h4 class="visually-hidden">Offers:</h4>

    <ul class="event__selected-offers">
      ${offers.map(({title, price}) => (`
        <li class="event__offer">
          <span class="event__offer-title">${title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${price}</span>
        </li>
      `)).join('')}
    </ul>
  `;
}

function createEventPointTemplate(point) {
  const {type, dateFrom, dateTo, basePrice, offers, destination} = point;

  const date = humanizePointDateFrom(dateFrom);
  const dateTime = getDateTime(dateFrom);
  const timeFrom = humanizePointTime(dateFrom);
  const timeTo = humanizePointTime(dateTo);
  const dateTimeFrom = getDateTime(dateFrom, true);
  const dateTimeTo = getDateTime(dateTo, true);

  const duration = getDurationString(dateFrom, dateTo);

  return `
    <div class="event">
      <time class="event__date" datetime="${dateTime}">${date}</time>
      <div class="event__type">
        <img
          class="event__type-icon"
          width="42"
          height="42"
          src="img/icons/${type}.png"
          alt="Event type icon"
        >
      </div>
      <h3 class="event__title">${type} ${destination.name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${dateTimeFrom}">${timeFrom}</time>
          &mdash;
          <time class="event__end-time" datetime="${dateTimeTo}">${timeTo}</time>
        </p>
        <p class="event__duration">${duration}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
      </p>

      ${offers.length ? createSelectedOffersTemplate(offers) : ''}

      <button class="event__favorite-btn event__favorite-btn--active" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
    </div>
  `;
}

export default class EventPointView extends AbstractView {
  #point = null;

  constructor({point}) {
    super();

    this.#point = point;
  }

  get template() {
    return createEventPointTemplate(this.#point);
  }
}
