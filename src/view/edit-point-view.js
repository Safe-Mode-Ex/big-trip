import dayjs from 'dayjs';
import {createElement} from './../render';
import { mockDestinations } from '../mock/destination';
import { mockOffers } from '../mock/offer';
import { TYPES } from '../const';

const EVENT_DATE_FORMAT = 'DD/MM/YY HH:mm';

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
                value="${eventType}"
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

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Cancel</button>
    </header>
  `;
}

function createEditPointDetailsTemplate({type, offers, destination}) {
  const offersByType = mockOffers.find((offer) => offer.type === type);
  const allOffers = offersByType ? offersByType.offers.filter(({id}) => !offers.some((offer) => id === offer.id)) : [];
  const hasOffers = Boolean(offers.length || allOffers.length);

  return `
    <section class="event__details">
        ${hasOffers ? (`
          <section class="event__section event__section--offers">
            <h3 class="event__section-title event__section-title--offers">Offers</h3>

            <div class="event__available-offers">
              ${offers.map(({id, title, price}) => (`
                <div class="event__offer-selector">
                  <input
                    class="event__offer-checkbox visually-hidden"
                    id="event-offer-${id}"
                    type="checkbox"
                    name="event-offer-${id}"
                    checked
                  >
                  <label class="event__offer-label" for="event-offer-${id}">
                  <span class="event__offer-title">${title}</span>
                  &plus;&euro;&nbsp;
                  <span class="event__offer-price">${price}</span>
                </label>
              </div>
            `))}

            ${allOffers.map(({id, title, price}) => (`
              <div class="event__offer-selector">
                <input
                  class="event__offer-checkbox visually-hidden"
                  id="event-offer-${id}"
                  type="checkbox"
                  name="event-offer-${id}"
                >
                <label class="event__offer-label" for="event-offer-${id}">
                  <span class="event__offer-title">${title}</span>
                  &plus;&euro;&nbsp;
                  <span class="event__offer-price">${price}</span>
                </label>
              </div>
            `))}
          </div>
        </section>
      `) : ''}

      <section class="event__section event__section--destination">
        <h3 class="event__section-title event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${destination.description}</p>

        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${destination.pictures.map(({src, description}) => (`
              <img class="event__photo" src="${src}" alt="${description}">
            `))}
          </div>
        </div>
      </section>
    </section>
  `;
}

function createEditPointTemplate(point) {
  const {type, destination, dateFrom, dateTo, basePrice, offers} = point;

  return `
    <form class="event event--edit" action="#" method="post">
      ${createEditPointHeaderTemplate({basePrice, type, dateFrom, dateTo, destination})}
      ${createEditPointDetailsTemplate({type, offers, destination})}
    </form>
  `;
}

export default class EditPointView {
  constructor(point) {
    this.point = point;
  }

  getTemplate() {
    return createEditPointTemplate(this.point);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
