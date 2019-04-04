import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    console.log(this.store.findAll('question'))
    return this.store.findAll('question');
  } 
});
