import dayjs from 'dayjs';
import AbstractView from '../framework/view/abstract-view';

const DURATION_DATE_FORMAT = 'DD MMM';
const RU_LOCALE = 'ru-RU';
const MIN_LONG_ROUTE_POINTS_COUNT = 3;

function createTripInfoTemplate(tripRoute, tripDuration, tripCost) {
  const formattedCost = new Intl.NumberFormat(RU_LOCALE, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(tripCost);

  return `
    <section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${tripRoute}</h1>
        <p class="trip-info__dates">${tripDuration}</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${formattedCost}</span>
      </p>
    </section>
  `;
}

export default class TripInfoView extends AbstractView {
  #tripRoute = '';
  #tripDuration = '';
  #tripCost = 0;

  constructor({points}) {
    super();

    this.#setTripRoute(points);
    this.#setTripDuration(points);
    this.#setTripCost(points);
  }

  get template() {
    return createTripInfoTemplate(
      this.#tripRoute,
      this.#tripDuration,
      this.#tripCost,
    );
  }

  #setTripRoute(points) {
    const cities = points.map(({destination}) => destination.name);
    const isLongRoute = new Set(cities).size > MIN_LONG_ROUTE_POINTS_COUNT;
    const {name: firstDestination} = points[0].destination;
    const {name: lastDestination} = points[points.length - 1].destination;

    this.#tripRoute = isLongRoute ?
      `${firstDestination} – ... – ${lastDestination}` :
      cities
        .filter((name, index, names) => !index || name !== names[index - 1])
        .join(' – ');
  }

  #setTripDuration(points) {
    const {dateFrom} = points[0];
    const {dateTo} = points[points.length - 1];
    const startDate = dayjs(dateFrom);
    const endDate = dayjs(dateTo);
    const isTheSameMonth = startDate.month() === endDate.month();
    const dateFromString = isTheSameMonth ?
      startDate.date() :
      startDate.format(DURATION_DATE_FORMAT);

    this.#tripDuration =
      `${dateFromString} - ${endDate.format(DURATION_DATE_FORMAT)}`.toUpperCase();
  }

  #setTripCost(points) {
    this.#tripCost = points.reduce((result, {basePrice, offers}) =>
      result + basePrice + offers.reduce(
        (offersPrice, {price}) =>offersPrice + price,
        0,
      ),
    0);
  }
}
