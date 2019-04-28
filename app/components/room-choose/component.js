import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),
  router: service(),

  actions: {
    createRoom(name) {
      if(name != undefined && name.trim()) {
        const store = this.get('store');
  
        store.createRecord('room', { name: `Pokój ${name}'a` }).save().then(model => {
          store.createRecord('user', { 
            name,
            isOwner: true,
            roomId: model.id,
            currentAnswer: '',
            points: 0
           }).save().then(() => this.get('router').transitionTo('room', model.id)).catch(() => {
             alert('Coś poszło nie tak');
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
          }).then(model => {
            this.get('store').createRecord('user', { 
              name,
              isOwner: false,
              roomId: model.id,
              currentAnswer: '',
              points: 0
             }).save().then(() => {
               this.get('router').transitionTo('room', model.id).catch(() => {
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
