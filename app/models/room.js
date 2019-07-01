import DS from 'ember-data';
import attr from 'ember-data/attr';

export default DS.Model.extend({
  name: attr(),
  userList: attr(),
  presentQuestions: attr(),
  usedQuestions: attr(),
  answeredQuestions: attr(),
  hasStarted: attr(),
  writingPhase: attr(),
  comparePhase: attr(),
  finalPhase: attr(),
});
