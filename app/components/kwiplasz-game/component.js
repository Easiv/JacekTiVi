import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),
  websockets: service(),
  room: null,
  socketRef: null,
  hasStarted: false,
  startRunning: false,
  roomId: null,
  user: null,
  userList: null,
  countdown: null,

  didInsertElement() {
    this._super(...arguments);
    const socket = this.websockets.socketFor('ws://localhost:3100/');

    socket.on('open', this.myOpenHandler, this);
    socket.on('message', this.myMessageHandler, this);
    socket.on('close', this.myCloseHandler, this);

    this.set('socketRef', socket);
  },

  willDestroyElement() {
    this._super(...arguments);
    const socket = this.socketRef;

    socket.off('open', this.myOpenHandler);
    socket.off('message', this.myMessageHandler);
    socket.off('close', this.myCloseHandler);
  },

  myOpenHandler(event) {
    console.log(`On open event has been called: ${event}`);
  },

  myMessageHandler(event) {
    console.log(`Message: ${event.data}`);

    if(event.data == 'writingKwipGame') {
      this.writingTime();
    }

    if(JSON.parse(event.data)[0] == 'startKwipGame') {
      const ids = JSON.parse(event.data)[1];
      this.start(ids);
    }
  },

  myCloseHandler(event) {
    console.log(`On close event has been called: ${event}`);
  },

  initiate() {
    this.get('store').findAll('question').then(questions => {
      this.get('store').findRecord('room', this.get('roomId')).then(room => {
        questions = questions.rejectBy('id', null);
        let randomed = this.randomThree(questions);

        room.set('usedQuestions', randomed);
        room.save();

        this.socketRef.send(JSON.stringify(['startKwipGame', randomed]));
      })
    })
  },

  start(ids) {
    let store = this.get('store');
    
    store.findRecord('room', this.get('roomId')).then(room => {
      store.findAll('user').then(users => {
        ids.forEach(id => {
          store.findRecord('question', id).then(question => {
            room.set('presentQuestions', [...room.presentQuestions, question]);
            room.save();
          })
        });

        let userList = users.filterBy('roomId', this.get('roomId'));
        room.set('userList', userList);
        room.set('hasStarted', true);
        room.set('writingTime', true);
        room.save();

        this.socketRef.send('writingKwipGame');
      });
    });
  },

  writingTime() {
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
  },

  randomThree(questions) {
    let maxInt = questions.length;
    let previousRandoms = [];
    let randomed = [];
    
    for(let i = 0; i < 3; i++) {
      let random = Math.floor(Math.random() * maxInt);

      if(previousRandoms.includes(random)) {
        i--;
      } else {
        randomed.pushObject(questions[random].id);
      }
      previousRandoms.push(random);
    }
    return randomed;
  },

  assignQuestions(users, questions) {
    console.log(users);
    console.log(questions);
  },

  actions: {
    startGame() {
      this.initiate();

      //6 pytan, bo na razie wersja na 3 osoby - pozniej ta pula rozdzielana jest posrod graczy
      // gdzie kazdy z nich konkuruje odpowiedzia, one rozdysponowane sa a - gracz, b - pytanie
      //  b1a1 : b1a2, b2a1 : b2a3, b3a2 : b3a3
      //  b4a1 : b4a2, b5a1: b5a3, b6a2 : b6a3;
    },
    
    success() {},

    error() {}
  },
});
