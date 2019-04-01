import Component from '@ember/component';

export default Component.extend({
  question: '',

  didRender() {
    fetch('http://localhost:3000/questions')
    .then(res => res.json())
    .then(res => this.set('question', res.name))
  }
});
