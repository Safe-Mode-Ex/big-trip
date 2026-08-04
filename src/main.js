import { render } from './framework/render';
import ListFilterView from './view/list-filter-view';
import TripPresenter from './presenter/trip-presenter';
import PointsModel from './model/points-model';
import { generateFilter } from './mock/filter';

const headerElement = document.querySelector('.page-header');
const mainElement = document.querySelector('.page-main');

const filtersElement = headerElement.querySelector('.trip-controls__filters');
const eventsElement = mainElement.querySelector('.trip-events');

const pointsModel = new PointsModel();
const eventsPresenter = new TripPresenter({
  eventsContainer: eventsElement,
  pointsModel,
});

const filters = generateFilter(pointsModel.points);
render(new ListFilterView({filters}), filtersElement);

eventsPresenter.init();
