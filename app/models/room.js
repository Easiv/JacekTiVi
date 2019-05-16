import DS from 'ember-data';
import attr from 'ember-data/attr';

export default DS.Model.extend({
  name: attr(),
  userList: attr(),
  hasStarted: attr(),
  writingPhase: attr(),
  comparePhase: attr(),
  finalPhase: attr(),
});
