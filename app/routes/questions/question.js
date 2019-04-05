import Route from '@ember/routing/route';

export default Route.extend({
  model(params) {
    return this.store.findRecord('question', params.question_id);
  }
})
