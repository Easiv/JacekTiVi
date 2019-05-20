import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),
  hasStarted: false,
  roomId: null,
  userList: null,
  questions: [],
  countdown: null,

  init() {
    this._super(...arguments);

    this.store.findAll('user').then(users => {
      let userList = users.filterBy('roomId', this.get('roomId'));
      this.set('userList', userList);
    });
  },

  writingTime() {
    this.get('store').findRecord('room', this.get('roomId')).then(room => {
      room.set('writingTime', true)
      room.save();

      let countdown = 60;
      this.set('countdown', countdown);
      
      let timer = setInterval(() => {
        if(countdown >= 0) {
          if(!this.get('countdown')) {
            clearInterval(timer);
          }
          this.set('countdown', countdown);
          countdown--;
        } 
        else {
          alert('Koniec czasu!');
          clearInterval(timer);
          return null;
        }
      }, 1000);
    });
  },

  randomThree(questions) {
    //questions = questions.rejectBy('id', '5ce2ec4e89278f0cdf8fd817');

    let maxInt = questions.length;
    let previousRandoms = [];
    
    for(let i = 0; i < 3; i++) {
      let random = Math.floor(Math.random() * maxInt);

      if(previousRandoms.includes(random)) {
        i--;
      } else {
        this.get('questions').pushObject(questions[random]);
      }
      previousRandoms.push(random);
    }
  },

  actions: {
    startGame() {
      this.get('store').findRecord('room', this.get('roomId')).then(room => {
        this.get('store').findAll('question').then(questions => {
          let used = room.usedQuestions;

          if(used.length) {
            used.forEach(q => {
              questions = questions.rejectBy('id', q.id)
            });
            this.randomThree(questions);
          } else {
            questions = questions.rejectBy('id', null)
            this.randomThree(questions);
          }
          this.get('questions').forEach(x => used.push(x.id));
        })
        room.set('hasStarted', true);
        room.save();
        this.writingTime();
      })  

      //6 pytan, bo na razie wersja na 3 osoby - pozniej ta pula rozdzielana jest posrod graczy
      // gdzie kazdy z nich konkuruje odpowiedzia, one rozdysponowane sa a - gracz, b - pytanie
      //  b1a1 : b1a2, b2a1 : b2a3, b3a2 : b3a3
      //  b4a1 : b4a2, b5a1: b5a3, b6a2 : b6a3;
    },

    success() {},

    error() {}
  },
});
