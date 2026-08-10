import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { mockOffers } from '../mock/offer';
import { mockDestinations } from '../mock/destination';
import { EMPTY_POINT, FLATPICKR_DATE_FORMAT } from '../const';
import EditPointHeaderView from '../view/edit-point-header-view';

const OFFER_ID_REGEXP = /-([^-]+)$/;

function createEditPointDetailsTemplate({offersByType, offers, destination}) {
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
                    name="event-offer[]"
                    checked
                  >
                  <label class="event__offer-label" for="event-offer-${id}">
                  <span class="event__offer-title">${title}</span>
                  &plus;&euro;&nbsp;
                  <span class="event__offer-price">${price}</span>
                </label>
              </div>
            `)).join('')}

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
            `)).join('')}
          </div>
        </section>
      `) : ''}

      ${destination ? (`
        <section class="event__section event__section--destination">
          <h3 class="event__section-title event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${destination.description}</p>

          <div class="event__photos-container">
            <div class="event__photos-tape">
              ${destination.pictures.map(({src, description}) => (`
                <img class="event__photo" src="${src}" alt="${description}">
              `)).join('')}
            </div>
          </div>
        </section>
      `) : ''}
    </section>
  `;
}

function createEditPointTemplate(point, headerElement, offersByType) {
  const {destination, offers} = point;

  return `
    <form class="event event--edit" action="#" method="post">
      ${headerElement.outerHTML}
      ${createEditPointDetailsTemplate({offersByType, offers, destination})}
    </form>
  `;
}

export default class EditPointView extends AbstractStatefulView {
  #offersByType = null;

  #headerView = null;
  #dateFromPicker = null;
  #dateToPicker = null;

  #handleFormSubmit = null;
  #handleDeleteClick = null;
  #handleEditFormClose = null;

  constructor({point = EMPTY_POINT, onFormSubmit, onDeleteClick, onClose}) {
    super();

    this._setState(point);
    this.#setOffersByType();

    this.#handleFormSubmit = onFormSubmit;
    this.#handleDeleteClick = onDeleteClick;
    this.#handleEditFormClose = onClose;

    this._restoreHandlers();
  }

  get template() {
    this.#headerView = new EditPointHeaderView({point: this._state});
    this.#setOffersByType();
    return createEditPointTemplate(this._state, this.#headerView.element, this.#offersByType);
  }

  removeElement() {
    super.removeElement();

    if (this.#dateFromPicker) {
      this.#dateFromPicker.destroy();
      this.#dateFromPicker = null;
    }

    if (this.#dateToPicker) {
      this.#dateToPicker.destroy();
      this.#dateToPicker = null;
    }
  }

  reset(point) {
    this.updateElement(point);
  }

  #setOffersByType() {
    this.#offersByType = mockOffers.find((offer) => offer.type === this._state.type);
  }

  #setDatepicker() {
    const commonConfig = {
      dateFormat: FLATPICKR_DATE_FORMAT,
      enableTime: true,
      minuteIncrement: 1,
      static: true,
      'time_24hr': true,
    };

    this.#dateFromPicker = flatpickr(
      this.element.querySelector('[name=event-start-time]'),
      {
        ...commonConfig,
        defaultDate: this._state.dateFrom,
        onChange: this.#dateFromChangeHandler,
      }
    );

    this.#dateToPicker = flatpickr(
      this.element.querySelector('[name=event-end-time]'),
      {
        ...commonConfig,
        defaultDate: this._state.dateTo,
        minDate: this._state.dateFrom,
        onChange: this.#dateToChangeHandler,
      }
    );

    if (!this._state.dateFrom) {
      this.#dateFromPicker.clear(false);
    }
    if (!this._state.dateTo) {
      this.#dateToPicker.clear(false);
    }
  }

  #dateFromChangeHandler = ([dateFrom]) => {
    this.#syncRangeLimits();
    this._setState({dateFrom});
  };

  #dateToChangeHandler = ([dateTo]) => {
    this.#syncRangeLimits();
    this._setState({dateTo});
  };

  #syncRangeLimits() {
    const from = this.#dateFromPicker.selectedDates[0];
    this.#dateToPicker.set('minDate', from ?? undefined);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(this._state);
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(this._state);
  };

  #changeTypeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    evt.preventDefault();

    this.updateElement({
      type: evt.target.value,
    });
  };

  #changeDestinationHandler = (evt) => {
    evt.preventDefault();

    const destination = mockDestinations.find(({name}) => name === evt.target.value);

    if (!destination) {
      return;
    }

    this.updateElement({destination});
  };

  #changePriceHandler = (evt) => {
    evt.preventDefault();

    this.updateElement({
      basePrice: evt.target.value,
    });
  };

  #changeOffersHandler = (evt) => {
    const offerId = evt.target.id.match(OFFER_ID_REGEXP)[1];

    const offers = evt.target.checked ?
      [...this._state.offers, this.#offersByType.offers.find(({id}) => id === offerId)] :
      this._state.offers.filter(({id}) => id !== offerId);

    this.updateElement({offers});
  };

  #closeEditFormHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditFormClose();
  };

  _restoreHandlers = () => {
    const offersElement = this.element.querySelector('.event__available-offers');

    if (offersElement) {
      offersElement.addEventListener('change', this.#changeOffersHandler);
    }

    if (this._state.id) {
      this.element.querySelector('.event__rollup-btn')
        .addEventListener('click', this.#closeEditFormHandler);
    }

    this.element.querySelector('.event__type-list')
      .addEventListener('change', this.#changeTypeHandler);
    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#changeDestinationHandler);
    this.element.querySelector('.event__input--price')
      .addEventListener('change', this.#changePriceHandler);

    this.element.addEventListener('submit', this.#formSubmitHandler);
    this.element.addEventListener('reset', this.#formDeleteClickHandler);

    this.#setDatepicker();
  };
}
