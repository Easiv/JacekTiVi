import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default Route.extend({
  currentuser: service(),

  model(params) {
    let user = this.get('currentuser').getId();

    return RSVP.hash({
      room: this.store.findRecord('room', params.room_id, { reload: true }),
      user: this.store.findRecord('user', user, { reload: true })
    })
  }
});
