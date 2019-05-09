import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  currentuser: service(),
  you: '',

  willRender() {
    this._super(...arguments);
    this.set('you', this.get('currentuser').getId());
  }
});
