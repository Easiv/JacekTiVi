import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),

  actions: {
    deleteQuestion(question) {
      if(confirm('Are you sure?')) {
        this.get('store').findRecord('question', question.id, {reload: true}).then(q => q.destroyRecord())
      }
    },

    updateQuestion(question) {
      this.get('store').findRecord('question', question.id).then(q => {
        q.set('name', 'abc');
        q.save()
      })

    }
  }
});
