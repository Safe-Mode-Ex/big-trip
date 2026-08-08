import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { mockOffers } from '../mock/offer';
import { mockDestinations } from '../mock/destination';
import { FLATPICKR_DATE_FORMAT } from '../const';
import EditPointHeaderView from '../view/edit-point-header-view';

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
    </section>
  `;
}

function createEditPointTemplate(point, headerElement) {
  const {type, destination, offers} = point;

  return `
    <form class="event event--edit" action="#" method="post">
      ${headerElement.outerHTML}
      ${createEditPointDetailsTemplate({type, offers, destination})}
    </form>
  `;
}

export default class EditPointView extends AbstractStatefulView {
  #headerView = null;
  #dateFromPicker = null;
  #dateToPicker = null;

  #handleFormSubmit = null;
  #handleFormReset = null;
  #handleEditFormClose = null;

  constructor({point, onFormSubmit, onFormReset, onClose}) {
    super();

    this._setState(point);

    this.#handleFormSubmit = onFormSubmit;
    this.#handleFormReset = onFormReset;
    this.#handleEditFormClose = onClose;

    this._restoreHandlers();
  }

  get template() {
    this.#headerView = new EditPointHeaderView({point: this._state});
    return createEditPointTemplate(this._state, this.#headerView.element);
  }

  removeElement() {
    super.removeElement();

    if (this.#dateFromPicker) {
      this.#dateFromPicker.destroy();
      this.#dateFromPicker = null;
    }
  }

  reset(point) {
    this.updateElement(point);
  }

  #setDatepicker() {
    const commonConfig = {
      dateFormat: FLATPICKR_DATE_FORMAT,
      enableTime: true,
    };

    this.#dateFromPicker = flatpickr(
      this.element.querySelector('[name=event-start-time]'),
      {
        ...commonConfig,
        defaultDate: this._state.dateFrom,
        maxDate: this._state.dateTo,
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
  }

  #dateFromChangeHandler = ([dateFrom]) => {
    this.#syncRangeLimits();
    this.updateElement({dateFrom});
  };

  #dateToChangeHandler = ([dateTo]) => {
    this.#syncRangeLimits();
    this.updateElement({dateTo});
  };

  #syncRangeLimits() {
    const from = this.#dateFromPicker.selectedDates[0];
    const to = this.#dateToPicker.selectedDates[0];

    this.#dateFromPicker.set('maxDate', to ?? undefined);
    this.#dateToPicker.set('minDate', from ?? undefined);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit();
  };

  #formResetHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormReset();
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

  #closeEditFormHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditFormClose();
  };

  _restoreHandlers = () => {
    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#closeEditFormHandler);
    this.element.querySelector('.event__type-list')
      .addEventListener('change', this.#changeTypeHandler);
    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#changeDestinationHandler);

    this.element.addEventListener('submit', this.#formSubmitHandler);
    this.element.addEventListener('reset', this.#formResetHandler);

    this.#setDatepicker();
  };
}
