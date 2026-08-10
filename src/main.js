import FilterModel from './model/filter-model';
import PointsModel from './model/points-model';
import FilterPresenter from './presenter/filter-presenter';
import TripPresenter from './presenter/trip-presenter';

const headerElement = document.querySelector('.page-header');
const mainElement = document.querySelector('.page-main');

const filterContainer = headerElement.querySelector('.trip-controls__filters');
const tripContainer = mainElement.querySelector('.trip-events');

const filterModel = new FilterModel();
const pointsModel = new PointsModel();

const filterPresenter = new FilterPresenter({
  filterContainer,
  filterModel,
  pointsModel,
});

const tripPresenter = new TripPresenter({
  tripContainer,
  pointsModel,
});

filterPresenter.init();
tripPresenter.init();
