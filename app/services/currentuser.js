import Service from '@ember/service';

export default Service.extend({
  id: '',

  changeId(id) {
    this.set('id', id)
    localStorage.setItem('id', id)
  },

  getId() {
    let id = this.get('id');

    if(id) {
      return id;
    }
    else {
      id = localStorage.getItem('id');
      return id;
    }
  }
});
