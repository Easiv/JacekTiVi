import Component from '@ember/component';

export default Component.extend({
  answer: null,
  room: null,

  actions: {
    submitAnswer(answer) {
      alert(answer);
      // this.set('answer', answer);
      // this.set('room.writingTime', false);
    }
  }
});
