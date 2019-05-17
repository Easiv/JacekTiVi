import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),
  router: service(),
  currentuser: service(),

  actions: {
    createRoom(name) {
      if(name != undefined && name.trim()) {
        const store = this.get('store');
  
        store.createRecord('room', { 
          name: `Pokój ${name}'a`,
          userList: [],
          usedQuestions: [],
          hasStarted: false,
          writingPhase: false,
          comparePhase: false,
          finalPhase: false
        }).save().then(m => {
          let room = m;
          store.createRecord('user', { 
            name,
            isOwner: true,
            roomId: room.id,
            currentAnswer: '',
            points: 0
           }).save().then(user => {
            room.set('userList', [{id: user.id, name: user.name}]);
            room.save();
            this.get('currentuser').changeId(user.id);
            this.get('router').transitionTo('room', room.id).catch(() => {
              alert('Coś poszło nie tak');
            });
          });
        });
      } else {
        alert('Nick nie może być pusty');
      }
    },

    findRoom(id, name) {
      if(id != undefined && id.trim()) {
        if(name != undefined && name.trim()) {
          this.get('store').findRecord('room', id).catch(() => {
            alert('Nie znaleziono pokoju z podanym id');
          }).then(m => {
            let room = m;
            this.get('store').createRecord('user', { 
              name,
              isOwner: false,
              roomId: room.id,
              currentAnswer: '',
              points: 0
             }).save().then(user => {
              room.set('userList', [...room.userList, {id: user.id, name: user.name}]);
              room.save();
              this.get('currentuser').changeId(user.id);
              this.get('router').transitionTo('room', room.id).catch(() => {
                alert('Coś poszło nie tak');
              });
            });
          });
        } else {
          alert('Nick nie może być pusty');
        }
      } else {
        alert('Id pokoju nie może być puste');
      }
    }
  }
});
