import AbstractView from '../framework/view/abstract-view';
import { mockOffers } from '../mock/offer';

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

function createEditPointTemplate(point) {
  const {type, destination, offers} = point;

  return `
    <form class="event event--edit" action="#" method="post">
      ${createEditPointDetailsTemplate({type, offers, destination})}
    </form>
  `;
}

export default class EditPointView extends AbstractView {
  #point = null;
  #handleFromSubmit = null;

  constructor({point, onFormSubmit}) {
    super();
    this.#point = point;
    this.#handleFromSubmit = onFormSubmit;
    this.element.addEventListener('submit', this.#formSubmitHandler);
  }

  get template() {
    return createEditPointTemplate(this.#point);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFromSubmit();
  };
}
