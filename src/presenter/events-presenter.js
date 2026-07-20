import { render } from './../render';
import EditPointView from './../view/edit-point-view';
import EventPointView from './../view/event-point';
import ListSortView from './../view/list-sort-view';
import ListView from './../view/list-view';

export default class EventsPresenter {
  listComponent = new ListView();

  constructor({eventsContainer}) {
    this.eventsContainer = eventsContainer;
  }

  init() {
    render(new ListSortView(), this.eventsContainer);
    render(this.listComponent, this.eventsContainer);
    render(new EditPointView(), this.listComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new EventPointView(), this.listComponent.getElement());
    }
  }
}
