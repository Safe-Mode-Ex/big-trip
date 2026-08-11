import { render } from './framework/render';
import FilterModel from './model/filter-model';
import PointsModel from './model/points-model';
import AddPointButtonView from './view/add-point-button-view';
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
  filterModel,
  onAddPointDestroy: handleAddPointFormClose,
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

render(addPointButtonComponent, headerElement.querySelector('.trip-main'));

filterPresenter.init();
tripPresenter.init();
