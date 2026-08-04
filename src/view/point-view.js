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

function createPointTemplate(point) {
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
    </div>
  `;
}

export default class PointView extends AbstractView {
  #point = null;

  constructor({point}) {
    super();

    this.#point = point;
  }

  get template() {
    return createPointTemplate(this.#point);
  }
}
