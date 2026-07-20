import { render } from './render';
import ListSortView from './view/list-sort-view';
import ListFilterView from './view/list-filter-view';

const headerElement = document.querySelector('.page-header');
const mainElement = document.querySelector('.page-main');

const filtersElement = headerElement.querySelector('.trip-controls__filters');
const eventsElement = mainElement.querySelector('.trip-events');

render(new ListFilterView(), filtersElement);
render(new ListSortView(), eventsElement);
