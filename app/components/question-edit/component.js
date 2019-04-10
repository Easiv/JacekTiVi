import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),
  router: service(),
  isEditing: false,

  actions: {
    toggleEdit() {
      if(this.isEditing) {
        this.set('isEditing', false)
      } else {
        this.set('isEditing', true)
      }
    },
    
    deleteQuestion(question) {
      if(confirm('Are you sure?')) {
        this.get('store').findRecord('question', question.id, {reload: true})
        .then(q => q.destroyRecord())
        .then(() => this.get('router').transitionTo('questions'))
      }
    },

    updateQuestion(question, name) {
      if(name.trim()) {
        this.get('store').findRecord('question', question.id).then(q => {
          q.set('name', name);
          q.save()
          this.set('isEditing', false);
        }) 
      } else {
        alert(`Name can't be empty`);
      }
    }
  }
});
