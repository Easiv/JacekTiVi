import Component from '@ember/component';

export default Component.extend({
  room: null,
  user: null,

  actions: {
    submitAnswer(answer) {
      let user = this.get('user');

      user.set('currentAnswer', answer);
      user.save();
    }
  }
});
