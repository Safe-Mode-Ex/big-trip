import { render } from './render';
import ListFilterView from './view/list-filter-view';
import EventsPresenter from './presenter/events-presenter';
import PointsModel from './model/points-model';

const headerElement = document.querySelector('.page-header');
const mainElement = document.querySelector('.page-main');

const filtersElement = headerElement.querySelector('.trip-controls__filters');
const eventsElement = mainElement.querySelector('.trip-events');

const pointsModel = new PointsModel();
const eventsPresenter = new EventsPresenter({
  eventsContainer: eventsElement,
  pointsModel,
});

render(new ListFilterView(), filtersElement);

eventsPresenter.init();
