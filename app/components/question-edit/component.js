import Component from '@ember/component';

export default Component.extend({
  isEditing: true,

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
