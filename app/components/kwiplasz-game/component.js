import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),
  hasStarted: false,
  roomId: null,
  userList: null,
  question: null,
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
      let timer = setInterval(() => {
        if(countdown >= 0) {
          this.set('countdown', countdown);
          countdown--;
        } else {
          alert('Koniec czasu!');
          clearInterval(timer);
          return null;
          //gdy nie wpisal ktos odpowiedzi wyslij ze nie wpisal
          // i tak czy siak
        }
      }, 1000);
    });
  },

  actions: {
    startGame() {
      this.get('store').queryRecord('question', {}).then(question => {
        this.set('question', question);
        this.get('store').findRecord('room', this.get('roomId')).then(room => {
          room.set('hasStarted', true);
          room.save();
          this.writingTime();
        })
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
