import Component from '@ember/component';

export default Component.extend({
  isEditing: false,

  actions: {
    toggleEdit() {
      if(this.isEditing) {
        this.set('isEditing', false)
      } else {
        this.set('isEditing', true)
      }
    }
  }
});
