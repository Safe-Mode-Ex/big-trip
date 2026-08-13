import AbstractView from '../framework/view/abstract-view';

function createTripInfoTemplate(tripRoute) {
  return `
    <section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${tripRoute}</h1>

        <p class="trip-info__dates">18&nbsp;&mdash;&nbsp;20 Mar</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">1230</span>
      </p>
    </section>
  `;
}

export default class TripInfoView extends AbstractView {
  #tripRoute = '';

  constructor({points}) {
    super();

    this.#setRoute(points);
  }

  get template() {
    return createTripInfoTemplate(this.#tripRoute);
  }

  #setRoute(points) {
    const {name: firstDestination} = points[0].destination;
    const {name: lastDestination} = points[points.length - 1].destination;

    this.#tripRoute = points.length > 3 ?
      `${firstDestination} – ... – ${lastDestination}` :
      points.join(' – ');
  }
}
