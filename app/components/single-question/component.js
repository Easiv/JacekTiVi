import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),
  room: null,
  user: null,
  question: null,

  actions: {
    submitAnswer(answer) {
      this.get('store').findRecord('room', this.get('room').id).then(room => {

        room.usedQuestions.forEach(qid => {
          if(qid == this.get('question').ident) {
            room.answeredQuestions.push({id: qid, answers: [{userId: this.get('user').id, answer: answer}]})
            room.save();
          }
        })
      })
    }
  }
});
