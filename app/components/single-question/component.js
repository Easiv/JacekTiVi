import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),
  room: null,
  user: null,

  actions: {
    submitAnswer(answer, question) {
      this.get('store').findRecord('room', this.get('room').id).then(room => {
        let answered = room.answeredQuestions;

        if(answered.length > 0) {
          let index;

          for(let ans of answered) {
            if(ans.id == question.ident) {
              index = answered.indexOf(ans);
            }
          }

          if(index > -1) {
            answered[index].answers.pushObject({
              userId: this.get('user').id,
              userName: this.get('user').name,
              answer: answer
            })
          }
        } else {
          alert('coś poszło nie tak z wysyłaniem odpowiedzi')
        }
        room.save();
      })
    }
  }
});
