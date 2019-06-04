import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),
  router: service(),

  actions: {
    submitQuestion(name) {
      this.get('store').createRecord('question', {
        name,
        ident: null
      }).save();
      
      this.get('router').transitionTo('questions');
    }
  }
});
