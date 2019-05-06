import Service from '@ember/service';

export default Service.extend({
  id: '',

  changeId(id) {
    this.set('id', id)
  }
});
