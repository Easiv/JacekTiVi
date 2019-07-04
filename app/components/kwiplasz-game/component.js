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

    this.socketRef.send(JSON.stringify(['newUser', this.get('room').userList.length]));
  },

  myMessageHandler(event) {
    console.log(`Message: ${event.data}`);
    
    if(JSON.parse(event.data)[0] == 'newUser') {
      if(this.get('room').userList.length < JSON.parse(event.data)[1]) {
        location.reload();
      }
    }

    if(JSON.parse(event.data) == 'writingKwipGame') {
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
        let answered = [];

        let setAnswers = () => {
          randomed.forEach(id => {
            this.get('store').findRecord('question', id).then(question => {
              answered.pushObject({
                id: question.ident,
                questionName: question.name,
                answers: []
              })
            })
          })
          return answered;
        }
        
        let letSave = async () => {
          await setAnswers()
          room.set('answeredQuestions', answered)
          room.set('usedQuestions', randomed);
          await room.save();
        }
        
        letSave();
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
        this.socketRef.send(JSON.stringify('writingKwipGame'));
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

  actions: {
    startGame() {
      this.initiate();
    },
    
    success() {},

    error() {}
  },
});
