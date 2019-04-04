import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),

  actions: {
    submitQuestion(name) {
      this.get('store').createRecord('question', {
        name
      }).save()
    }
  }
});
