import { render } from './framework/render';
import { AUTHORIZATION, END_POINT } from './config';
import FilterModel from './model/filter-model';
import PointsModel from './model/points-model';
import AddPointButtonView from './view/add-point-button-view';
import TripInfoPresenter from './presenter/trip-info-presenter';
import FilterPresenter from './presenter/filter-presenter';
import TripPresenter from './presenter/trip-presenter';
import TripApiService from './api/trip-api-service';

const headerElement = document.querySelector('.page-header');
const mainElement = document.querySelector('.page-main');

const filterContainer = headerElement.querySelector('.trip-controls__filters');
const tripContainer = mainElement.querySelector('.trip-events');
const tripInfoContainer = headerElement.querySelector('.trip-main');

const filterModel = new FilterModel();
const pointsModel = new PointsModel({
  tripApiService: new TripApiService(END_POINT, AUTHORIZATION),
});

const tripInfoPresenter = new TripInfoPresenter({
  tripInfoContainer,
  pointsModel,
});

const filterPresenter = new FilterPresenter({
  filterContainer,
  filterModel,
  pointsModel,
});

const tripPresenter = new TripPresenter({
  tripContainer,
  pointsModel,
  filterModel,
  onAddPointDestroy: handleAddPointFormClose,
  onTripClear: handleTripClear,
});

const addPointButtonComponent = new AddPointButtonView({
  onClick: handleAddPointButtonClick,
});

function handleAddPointFormClose() {
  addPointButtonComponent.element.disabled = false;
}

function handleAddPointButtonClick() {
  tripPresenter.createPoint();
  addPointButtonComponent.element.disabled = true;
}

function handleTripClear() {
  tripInfoPresenter.destroy();
}

tripInfoPresenter.init();
filterPresenter.init();
tripPresenter.init();
pointsModel.init()
  .finally(() => {
    render(addPointButtonComponent, tripInfoContainer);
  });
