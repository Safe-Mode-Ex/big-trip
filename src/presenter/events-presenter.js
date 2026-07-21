import { render } from './../render';
import EditPointView from './../view/edit-point-view';
import EventPointView from './../view/event-point';
import ListSortView from './../view/list-sort-view';
import ListView from './../view/list-view';

export default class EventsPresenter {
  listComponent = new ListView();

  constructor({eventsContainer, pointsModel}) {
    this.eventsContainer = eventsContainer;
    this.pointsModel = pointsModel;
  }

  init() {
    this.eventsPoints = [...this.pointsModel.getPoints()];

    render(new ListSortView(), this.eventsContainer);
    render(this.listComponent, this.eventsContainer);
    render(new EditPointView(), this.listComponent.getElement());

    for (const point of this.eventsPoints) {
      render(new EventPointView({point}), this.listComponent.getElement());
    }
  }
}
